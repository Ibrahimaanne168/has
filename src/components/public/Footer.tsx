import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-1">
                <Image
                  src="/images/logo_has.jpg"
                  alt="HAS Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Halil Académie Scientifique
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Centre d'excellence et d'encadrement académique pour les sciences exactes,
              l'informatique, les mathématiques et les sciences sociales.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/presentation" className="hover:text-white transition-colors">
                  Présentation
                </Link>
              </li>
              <li>
                <Link href="/professeurs" className="hover:text-white transition-colors">
                  Équipe Enseignante
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>+221 75 650 20 17</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>contact@academie-has.sn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HAS — Halil Académie Scientifique. Tous droits réservés.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Conçu avec excellence académique.
          </p>
        </div>
      </div>
    </footer>
  );
}
