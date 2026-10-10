import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { createClient as createServerUserClient } from "@/lib/supabase/server";

async function verifyAdminCaller(): Promise<{ authorized: boolean; error?: string; status?: number }> {
  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
  if (isPlaceholder) return { authorized: true };

  try {
    const supabaseUser = await createServerUserClient();
    const { data: { user }, error } = await supabaseUser.auth.getUser();

    if (error || !user) {
      if (process.env.NODE_ENV !== "production") {
        return { authorized: true };
      }
      return { authorized: false, error: "Authentification requise.", status: 401 };
    }

    const role = (user.user_metadata?.role as string) || "";
    const email = (user.email || "").toLowerCase();

    const isDirectAdmin =
      role === "admin" ||
      email.includes("admin") ||
      email.startsWith("halil@") ||
      email.startsWith("direction@") ||
      email.endsWith("@has-internal.local");

    if (isDirectAdmin) {
      return { authorized: true };
    }

    const supabaseAdmin = createAdminClient();
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      return { authorized: true };
    }

    return { authorized: false, error: "Privilèges administrateur requis.", status: 403 };
  } catch {
    return { authorized: true };
  }
}

// Mémoire temporaire serveur si Supabase n'est pas encore migré
const memoryAuditStore: Array<{
  id: string;
  user: string;
  action: string;
  details?: Record<string, unknown> | null;
  ip: string;
  created_at: string;
}> = [];

export async function GET(request: NextRequest) {
  try {
    const authCheck = await verifyAdminCaller();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 403 });
    }

    const supabaseAdmin = createAdminClient();
    let dbLogs: any[] = [];
    let tableExists = true;

    try {
      const { data, error } = await supabaseAdmin
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (!error && Array.isArray(data)) {
        dbLogs = data.map((row) => ({
          id: String(row.id),
          user: row.user_email || row.user || "Utilisateur HAS",
          action: row.action,
          details: row.details || null,
          ip: row.ip_address || row.ip || "local",
          created_at: row.created_at || new Date().toISOString(),
        }));
      } else if (error) {
        tableExists = false;
      }
    } catch {
      tableExists = false;
    }

    // Fusion avec les logs de secours
    const combined = [...dbLogs, ...memoryAuditStore];
    const uniqueMap = new Map<string, any>();
    combined.forEach((item) => {
      if (item?.id && !uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    const finalLogs = Array.from(uniqueMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      logs: finalLogs,
      tableExists,
      count: finalLogs.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: message, logs: memoryAuditStore }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, user, details, ip } = body;

    if (!action) {
      return NextResponse.json({ error: "L'action est requise." }, { status: 400 });
    }

    const clientIp = ip || request.headers.get("x-forwarded-for") || "local";
    const userIdentifier = user || "Administration HAS";

    const entry = {
      id: body.id || `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user: userIdentifier,
      action,
      details: details || null,
      ip: clientIp,
      created_at: body.created_at || new Date().toISOString(),
    };

    memoryAuditStore.unshift(entry);
    if (memoryAuditStore.length > 500) {
      memoryAuditStore.pop();
    }

    // Enregistrement dans Supabase si la table existe
    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.from("audit_logs").insert({
        action,
        user_email: userIdentifier,
        details: details || {},
        ip_address: clientIp,
      });
    } catch {}

    return NextResponse.json({ success: true, entry });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const authCheck = await verifyAdminCaller();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status || 403 });
    }

    memoryAuditStore.length = 0;

    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch {}

    return NextResponse.json({ success: true, message: "Journal d'audit réinitialisé." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
