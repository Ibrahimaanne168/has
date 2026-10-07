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
    <section id="contact" className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0B0F14] border-t border-slate-200/80 dark:border-[#263241] transition-colors">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-xl p-6 sm:p-10 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
          {/* En-tête */}
          <div className="mb-8">
            <p className="text-[#e0521c] text-[11px] font-bold tracking-wider uppercase mb-2">
              Formulaire de Contact
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Nous Contacter
            </h2>
            <p className="mt-2 text-slate-500 dark:text-[#AAB4C0] text-xs sm:text-sm leading-relaxed">
              Une question sur nos séances de renforcement, les modalités d&apos;inscription ou notre encadrement ?
              Transmettez-nous votre demande, notre secrétariat vous répondra dans les plus brefs délais.
            </p>
          </div>

          {/* Feedback */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-200">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-rose-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-rose-200">{errorMsg}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            {/* Nom complet */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                Nom complet <span className="text-[#e0521c]" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Ex. Amadou Diallo"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                  Adresse email <span className="text-[#e0521c]" aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="amadou@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] transition-colors"
                />
              </div>

              {/* Téléphone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                  Numéro de téléphone
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="+221 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] transition-colors"
                />
              </div>
            </div>

            {/* Objet */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                Objet de votre demande <span className="text-[#e0521c]" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                placeholder="Ex. Renseignements sur les cours de renforcement"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] transition-colors"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                Votre message <span className="text-[#e0521c]" aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Précisez votre niveau universitaire, vos besoins ou toute question..."
                className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] transition-colors resize-none"
              />
            </div>

            {/* Bouton d'action */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={isLoading}
              rightIcon={<Send className="w-4 h-4" />}
              className="w-full justify-center min-h-[46px] text-sm font-semibold mt-2 rounded-lg"
            >
              Envoyer le message
            </Button>

            <p className="text-[11px] text-center text-slate-400 dark:text-[#687585] mt-1">
              Halil Académie Scientifique — Dakar, Sénégal
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
