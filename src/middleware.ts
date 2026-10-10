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

  // 1. Purge des anciens cookies corrompus contenant des images base64 (évite l'erreur HTTP 431)
  const allCookies = request.cookies.getAll();
  const corruptedCookies = allCookies.filter(
    (c) =>
      !c.name.startsWith("sb-") &&
      !c.name.includes("auth-token") &&
      (c.value.includes("data%3Aimage") || c.value.includes("data:image"))
  );

  if (corruptedCookies.length > 0) {
    corruptedCookies.forEach((c) => {
      response.cookies.delete(c.name);
    });
  }

  let user = null;
  let supabase;

  try {
    supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch (authError) {
    console.warn("[Middleware] Erreur auth ou cookie corrompu:", authError);
    // En cas d'erreur de parsing JWT ou cookie corrompu, redirection propre vers /connexion avec suppression des cookies auth
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    allCookies.forEach((c) => {
      if (c.name.includes("auth-token") || c.name.includes("sb-")) {
        redirectRes.cookies.delete(c.name);
      }
    });
    return redirectRes;
  }

  // Non authentifié -> redirection vers /connexion
  if (!user) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((c) => {
      redirectRes.cookies.set(c.name, c.value);
    });
    return redirectRes;
  }

  // Récupération du rôle : vérification profiles si possible, avec fallback robuste sur user_metadata et email
  let userRole = (user.user_metadata?.role as string) || null;
  const meta = user.user_metadata || {};
  let isActive = true;

  if (userRole === "etudiant") {
    isActive = meta.is_active === true && meta.statut_inscription === "valide";
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active, statut_inscription")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      if (profile.role) userRole = profile.role;
      if (profile.role === "etudiant") {
        isActive = profile.is_active === true && profile.statut_inscription === "valide";
      } else if (profile.is_active !== undefined && profile.is_active !== null) {
        isActive = profile.is_active;
      }
    }
  } catch {
    // Si la table profiles n'est pas encore initialisée en base
  }

  // Si le compte est en attente de validation ou inactif
  if (!isActive) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set(
      "error",
      "Votre inscription est actuellement en attente de validation par l'administration de HAS."
    );
    const redirectRes = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value));
    return redirectRes;
  }

  // Déduction stricte et prioritaire du rôle administrateur (El Hadji / Halil / Direction)
  const email = (user.email || "").toLowerCase();
  const metaUsername = (meta.username || "").toLowerCase();
  const metaFullName = (meta.full_name || "").toLowerCase();

  const isAdmin =
    userRole === "admin" ||
    meta.role === "admin" ||
    email.startsWith("ibou@") ||
    email.startsWith("halil@") ||
    email.startsWith("direction@") ||
    email.includes("admin") ||
    email.endsWith("@has-internal.local") ||
    metaUsername === "ibou" ||
    metaUsername === "halil" ||
    metaFullName === "el hadji";

  if (isAdmin) {
    userRole = "admin";
  } else if (!userRole) {
    if (email.includes("prof")) {
      userRole = "professeur";
    } else {
      userRole = "etudiant";
    }
  }

  // Contrôle d'accès par rôle
  if (isProtectedAdmin && userRole !== "admin") {
    const targetUrl = new URL(userRole === "professeur" ? "/professeur" : "/etudiant", request.url);
    const redirectRes = NextResponse.redirect(targetUrl);
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value));
    return redirectRes;
  }

  if (isProtectedProfesseur && userRole !== "professeur" && userRole !== "admin") {
    const redirectRes = NextResponse.redirect(new URL("/etudiant", request.url));
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value));
    return redirectRes;
  }

  if (isProtectedEtudiant && userRole !== "etudiant" && userRole !== "admin") {
    const redirectRes = NextResponse.redirect(new URL("/professeur", request.url));
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value));
    return redirectRes;
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
