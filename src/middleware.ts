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

  // Vérification du rôle dans la table profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.is_active === false) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("error", "Compte désactivé ou introuvable");
    return NextResponse.redirect(loginUrl);
  }

  const userRole = profile.role;

  // Contrôle d'accès strict
  if (isProtectedAdmin && userRole !== "admin") {
    // Redirige vers son propre espace selon le rôle
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
