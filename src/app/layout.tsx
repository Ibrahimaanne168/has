import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Halil Académie Scientifique (HAS) | Portail Officiel",
  description:
    "Halil Académie Scientifique — Établissement d'enseignement supérieur d'excellence spécialisé en sciences de l'ingénieur, technologies du numérique et management.",
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
    <html lang="fr" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-accent-100 selection:text-accent-900">
        {children}
      </body>
    </html>
  );
}
