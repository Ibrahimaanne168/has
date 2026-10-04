import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const isProtectedEtudiant = pathname.startsWith("/etudiant");
  const isProtectedProfesseur = pathname.startsWith("/professeur");
  const isProtectedAdmin = pathname.startsWith("/admin");

  if (!isProtectedEtudiant && !isProtectedProfesseur && !isProtectedAdmin) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si clés non encore configurées (première installation/aperçu local)
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Non authentifié -> redirection vers /connexion
  if (!user) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Récupération du rôle : vérification profiles si possible, avec fallback robuste sur user_metadata et email
  let userRole = (user.user_metadata?.role as string) || null;
  let isActive = true;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      if (profile.role) userRole = profile.role;
      if (profile.is_active !== undefined && profile.is_active !== null) {
        isActive = profile.is_active;
      }
    }
  } catch {
    // Si la table profiles n'est pas encore initialisée en base
  }

  // Si le compte est explicitement désactivé
  if (!isActive) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("error", "Compte désactivé");
    return NextResponse.redirect(loginUrl);
  }

  // Déduction automatique du rôle si non encore renseigné
  if (!userRole) {
    const email = (user.email || "").toLowerCase();
    if (email.includes("admin") || email.startsWith("halil@") || email.startsWith("direction@") || email.endsWith("@has-internal.local")) {
      userRole = "admin";
    } else if (email.includes("prof") || email.endsWith("@has-academie.online")) {
      userRole = "professeur";
    } else {
      userRole = "etudiant";
    }
  }

  // Contrôle d'accès par rôle
  if (isProtectedAdmin && userRole !== "admin") {
    if (userRole === "professeur") {
      return NextResponse.redirect(new URL("/professeur", request.url));
    }
    return NextResponse.redirect(new URL("/etudiant", request.url));
  }

  if (isProtectedProfesseur && userRole !== "professeur" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/etudiant", request.url));
  }

  if (isProtectedEtudiant && userRole !== "etudiant" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/professeur", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/etudiant/:path*",
    "/professeur/:path*",
    "/admin/:path*",
  ],
};
