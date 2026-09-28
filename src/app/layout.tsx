import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Halil Académie Scientifique (HAS) | Portail Officiel",
  description:
    "Halil Académie Scientifique — Établissement d'enseignement supérieur d'excellence spécialisé en sciences fondamentales, ingénierie et technologies du numérique.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${ibmPlexSans.variable}`}>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#0f2744]/10 selection:text-[#0f2744]">
        {children}
      </body>
    </html>
  );
}
