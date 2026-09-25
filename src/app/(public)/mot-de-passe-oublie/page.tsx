"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, User, ShieldAlert } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [identifiant, setIdentifiant] = useState("");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN || "221770000000";

  const getWhatsappUrl = () => {
    let msg = "Bonjour, je n'arrive pas à me connecter à la plateforme HAS et je souhaite réinitialiser mon mot de passe.";
    if (identifiant.trim()) {
      msg += ` Mon identifiant / login est : ${identifiant.trim()}`;
    }
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <Image
            src="/images/logo_has.jpg"
            alt="HAS Académie"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h2 className="mt-6 text-2xl font-bold font-display tracking-tight text-slate-900">
          Mot de passe oublié ?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 px-4">
          Pour des raisons de sécurité académique, contactez le support administratif sur WhatsApp pour réinitialiser vos accès.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Votre identifiant / Login (optionnel)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                placeholder="Ex: pren.nom ou numéro étudiant"
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Indiquer votre identifiant permet à l&apos;équipe administrative de traiter votre demande plus vite.
            </p>
          </div>

          <a
            href={getWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contacter l&apos;administration sur WhatsApp</span>
          </a>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour à la page de connexion</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
