import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0f2744",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://halil-academie.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Halil Académie Scientifique (HAS) | Portail Officiel",
    template: "%s | Halil Académie Scientifique",
  },
  description:
    "Halil Académie Scientifique — Établissement d'enseignement supérieur d'excellence spécialisé en sciences fondamentales, mathématiques, physique, génie civil, énergies et ingénierie numérique.",
  applicationName: "Halil Académie Scientifique",
  authors: [{ name: "Halil Académie Scientifique" }],
  keywords: [
    "Halil Académie Scientifique",
    "HAS",
    "Université Bamako",
    "Informatique",
    "Génie Logiciel",
    "Mathématiques",
    "Physique",
    "Génie Civil",
    "Énergies Renouvelables",
    "Enseignement Supérieur",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Halil Académie Scientifique (HAS) | Portail Officiel",
    description:
      "Établissement d'enseignement supérieur d'excellence — Mathématiques, Physique & Informatique. Formations académiques certifiées.",
    url: siteUrl,
    siteName: "Halil Académie Scientifique",
    images: [
      {
        url: "/images/logo-has.jpg",
        width: 756,
        height: 756,
        alt: "Logo officiel Halil Académie Scientifique",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Halil Académie Scientifique (HAS)",
    description:
      "Portail officiel de l'Académie scientifique d'excellence — Formations et recherche appliquée.",
    images: ["/images/logo-has.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${fraunces.variable} ${ibmPlexSans.variable}`}>
      <head>
        {/* Anti-FOUC et purge automatique des cookies surdimensionnés pour mobile */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Nettoyage immédiat des anciens cookies auth surdimensionnés pour éviter l'erreur HTTP 431
                  if (typeof document !== 'undefined' && document.cookie) {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                      var c = cookies[i].trim();
                      var eqIdx = c.indexOf('=');
                      if (eqIdx !== -1) {
                        var cName = c.substring(0, eqIdx);
                        var cVal = c.substring(eqIdx + 1);
                        if (cVal.length > 2000 || cVal.indexOf('data%3Aimage') !== -1 || cVal.indexOf('data:image') !== -1) {
                          document.cookie = cName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                          document.cookie = cName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
                        }
                      }
                    }
                  }

                  var t = localStorage.getItem('has_theme');
                  var isDark = t === 'dark' || (!t && true);
                  if (t === 'light') isDark = false;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* Lien direct favicon 48x48 recommandé par Google pour l'indexation du logo dans les résultats de recherche */}
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] antialiased selection:bg-[#e0521c]/25 selection:text-[#F5F7FA] transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
