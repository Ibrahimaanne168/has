import { NextRequest, NextResponse } from "next/server";
import { signupStep2Schema } from "@/lib/validators";
import { createAdminClient } from "@/lib/supabase/service-role";
import { sendTelegramAdminNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = signupStep2Schema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { email, code, fullName, username, password } = parseResult.data;
    const supabaseAdmin = createAdminClient();

    // 1. Vérification que le code a bien été vérifié
    const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

    if (!isPlaceholder) {
      const cleanEmail = email.toLowerCase().trim();
      const cleanCode = code.trim();

      const { data: codeRecords } = await supabaseAdmin
        .from("verification_codes")
        .select("*")
        .eq("email", cleanEmail)
        .eq("type", "signup_2fa")
        .order("created_at", { ascending: false })
        .limit(5);

      const validRecord = codeRecords?.find(
        (r) => String(r.code).trim() === cleanCode && r.verified === true
      );

      if (!validRecord) {
        return NextResponse.json(
          { error: "Le code 2FA n'a pas été validé au préalable. Veuillez recommencer la vérification." },
          { status: 403 }
        );
      }
    }

    // 2.5 Vérification unicité du username (en ignorant les comptes refusés)
    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Chercher dans la table profiles
    try {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, statut_inscription")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (existingProfile && existingProfile.statut_inscription !== "refuse") {
        const base = cleanUsername.replace(/[^a-z0-9]/g, "");
        const year = new Date().getFullYear().toString().slice(-2);
        const r = () => Math.floor(10 + Math.random() * 90);
        const suggestions = [...new Set([`${base}${year}`, `${base}${r()}`, `${base}_has`, `${base}${r()}`])].slice(0, 4);
        return NextResponse.json(
          { error: `L'identifiant « ${cleanUsername} » est déjà pris.`, suggestions },
          { status: 409 }
        );
      }
    } catch {}

    // Chercher dans Supabase Auth metadata
    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const usersList = allUsers?.users || [];

    // Vérifier si le username est pris par un compte actif/en attente
    const usernameTakenByActive = usersList.some((u) => {
      const meta = u.user_metadata || {};
      if (meta.statut_inscription === "refuse") return false; // Libéré !
      return (meta.username || "").toLowerCase() === cleanUsername;
    });

    if (usernameTakenByActive) {
      const base = cleanUsername.replace(/[^a-z0-9]/g, "");
      const year = new Date().getFullYear().toString().slice(-2);
      const r = () => Math.floor(10 + Math.random() * 90);
      const suggestions = [...new Set([`${base}${year}`, `${base}${r()}`, `${base}_has`, `${base}${r()}`])].slice(0, 4);
      return NextResponse.json(
        { error: `L'identifiant « ${cleanUsername} » est déjà pris.`, suggestions },
        { status: 409 }
      );
    }

    // 2.6 Vérification email : Si l'email appartenait à un compte refusé, on purge l'ancien compte pour libérer l'email
    const existingSameEmailUser = usersList.find(
      (u) => (u.email || "").toLowerCase() === cleanEmail
    );

    if (existingSameEmailUser) {
      const isRefused = existingSameEmailUser.user_metadata?.statut_inscription === "refuse";
      if (isRefused) {
        try {
          // Supprimer l'ancien compte rejeté dans auth.users pour réactiver l'email
          await supabaseAdmin.auth.admin.deleteUser(existingSameEmailUser.id);
        } catch (delErr) {
          console.warn("[DELETE-REFUSED-USER-WARN]", delErr);
        }
        try {
          await supabaseAdmin.from("profiles").delete().eq("id", existingSameEmailUser.id);
        } catch {}
      } else {
        return NextResponse.json(
          { error: "Cette adresse email est déjà associée à un compte valide ou en cours d'examen." },
          { status: 409 }
        );
      }
    }

    // 3. Calcul séquentiel du matricule étudiant officiel (format : ETU001, ETU002, ...)
    let maxEtudiantNum = 0;
    for (const u of usersList) {
      if (u.user_metadata?.role === "etudiant") {
        const m = (u.user_metadata?.matricule || "").trim();
        const match = m.match(/^ETU(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxEtudiantNum) {
            maxEtudiantNum = num;
          }
        }
      }
    }
    const matricule = `ETU${String(maxEtudiantNum + 1).padStart(3, "0")}`;

    const filiereChoice = parseResult.data.filiere || "MPI";
    const niveauChoice = parseResult.data.niveau || "L1";
    const classeChoice = `${niveauChoice}-${filiereChoice}`;

    const phone = typeof body?.phone === "string" ? body.phone.trim() : null;

    // 3. Création du compte dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        username,
        role: "etudiant",
        filiere: filiereChoice,
        niveau: niveauChoice,
        classe: classeChoice,
        matricule,
        phone,
        is_active: false,
        statut_inscription: "en_attente",
      },
    });

    if (authError) {
      console.error("[SUPABASE-AUTH-ERROR]", authError);
      return NextResponse.json(
        { error: `Erreur d'inscription: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 4. Insertion dans la table profiles (is_active: false car en attente de validation admin)
    const baseProfileData = {
      id: userId,
      email,
      username: username || null,
      full_name: fullName,
      role: "etudiant",
      matricule,
      telephone: phone || null,
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Tenter avec statut_inscription en premier
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      ...baseProfileData,
      statut_inscription: "en_attente",
    });

    if (profileError) {
      console.warn("[PROFILE-INSERT-OPTIONAL-FAILED, RETRYING CORE]", profileError.message);
      // Fallback avec uniquement les colonnes du schéma officiel profiles.sql
      const { error: coreError } = await supabaseAdmin.from("profiles").upsert(baseProfileData);
      if (coreError) {
        console.error("[PROFILE-INSERT-CORE-ERROR]", coreError.message);
      }
    }

    // 5. Notification Telegram immédiate à l'administrateur HAS (avec boutons d'action directs)
    try {
      await sendTelegramAdminNotification({
        studentId: userId,
        fullName,
        filiere: filiereChoice,
        niveau: niveauChoice,
        username,
        phone: null,
      });
    } catch (teleErr) {
      console.warn("[TELEGRAM-NOTIF-FAILED]", teleErr);
    }

    // 6. Journalisation d'audit
    try {
      const ip = request.headers.get("x-forwarded-for") || "local";
      await supabaseAdmin.from("audit_logs").insert({
        user_id: userId,
        action: "DEMANDE_INSCRIPTION_ETUDIANT",
        details: { email, matricule, username, filiere: filiereChoice, niveau: niveauChoice },
        ip_address: ip,
      });
    } catch (auditErr) {
      console.warn("[AUDIT-LOG-FAIL]", auditErr);
    }

    return NextResponse.json({
      success: true,
      pendingApproval: true,
      message: "Votre demande d'inscription a été transmise à l'administration de HAS. L'administrateur va valider votre dossier.",
      user: {
        id: userId,
        email,
        fullName,
        username,
        matricule,
        filiere: filiereChoice,
        niveau: niveauChoice,
        role: "etudiant",
        is_active: false,
        statut_inscription: "en_attente",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    console.error("[SIGNUP-STEP2-ERROR]", message);
    return NextResponse.json(
      { error: "Impossible de finaliser l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
