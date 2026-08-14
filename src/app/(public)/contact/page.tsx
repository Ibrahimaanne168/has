"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          nom: formData.get("nom"),
          prenom: formData.get("prenom"),
          telephone: formData.get("telephone"),
          sujet: formData.get("sujet"),
          destinataire_type: formData.get("destinataire_type") || "administration",
          message: formData.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Votre message a bien été envoyé !");
        setSent(true);
        form.reset();
      } else {
        toast.error("Erreur lors de l'envoi du message.");
      }
    } catch (err) {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Nous Contacter
        </span>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Une Question ? Écrivez-nous
        </h1>
        <p className="text-base text-slate-600">
          Que vous soyez étudiant, parent ou futur inscrit, notre équipe pédagogique vous répond
          dans les plus brefs délais.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Contact info cards */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">Téléphone</h3>
            <p className="mt-1 text-sm text-slate-600">+221 75 650 20 17</p>
            <p className="text-xs text-slate-400 mt-2">Du Lundi au Samedi, 8h - 19h</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">Email</h3>
            <p className="mt-1 text-sm text-slate-600">contact@academie-has.sn</p>
            <p className="text-xs text-slate-400 mt-2">Réponse sous 24h ouvrées</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">Localisation</h3>
            <p className="mt-1 text-sm text-slate-600">Dakar, Sénégal</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-card">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Message Envoyé !
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Merci pour votre message. Un responsable pédagogique prendra contact avec vous très
                prochainement.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    placeholder="Votre prénom"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    placeholder="Votre nom"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Ex: 77 123 45 67"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Destinataire
                  </label>
                  <select
                    name="destinataire_type"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  >
                    <option value="administration">Administration Générale</option>
                    <option value="direction">Direction Académique</option>
                    <option value="responsable_pedagogique">Responsable Pédagogique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  name="sujet"
                  required
                  placeholder="Ex: Demande de renseignements inscription..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Expliquez votre demande ici..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le message</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
