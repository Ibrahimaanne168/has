"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || "Demande d'information",
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible d'envoyer le message.");
      }

      setSuccessMsg(data.message || "Votre message a été transmis avec succès à notre équipe.");
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de transmission";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        {/* En-tête */}
        <div className="mb-10">
          <p className="text-[#e0521c] text-xs font-bold tracking-widest uppercase mb-3">
            Formulaire de Contact
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f2744] leading-snug">
            Nous Contacter
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
            Une question sur nos séances de renforcement, les modalités d&apos;inscription ou notre encadrement ?
            Envoyez-nous votre message ci-dessous, notre équipe vous répondra rapidement.
          </p>
        </div>

        {/* Feedback */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{errorMsg}</p>
          </div>
        )}

        {/* Formulaire — tous les champs empilés sur mobile, labels toujours visibles */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nom complet */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
              Nom complet <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Ex. Amadou Diallo"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20 transition-colors min-h-[48px]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">
              Adresse email <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="amadou@exemple.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20 transition-colors min-h-[48px]"
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className="text-sm font-medium text-slate-700">
              Numéro de téléphone
            </label>
            <input
              id="contact-phone"
              type="tel"
              placeholder="+221 ..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20 transition-colors min-h-[48px]"
            />
          </div>

          {/* Objet */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700">
              Objet de votre demande <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              required
              placeholder="Ex. Renseignements sur les cours de renforcement"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20 transition-colors min-h-[48px]"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
              Votre message <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Précisez votre niveau universitaire, vos besoins ou toute question..."
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20 transition-colors resize-none"
            />
          </div>

          {/* Bouton pleine largeur sur mobile */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            isLoading={isLoading}
            rightIcon={<Send className="w-4 h-4" />}
            className="w-full justify-center min-h-[52px] text-base font-semibold mt-1"
          >
            Envoyer le message
          </Button>

          <p className="text-xs text-center text-slate-400">
            Halil Académie Scientifique — Sénégal
          </p>
        </form>
      </div>
    </section>
  );
}
