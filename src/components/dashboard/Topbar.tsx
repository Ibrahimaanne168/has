import Link from "next/link";
import { Bell, Search, ExternalLink } from "lucide-react";

interface TopbarProps {
  title: string;
  description?: string;
  user: {
    prenom: string;
    nom: string;
    role_name?: string;
  };
}

export function Topbar({ title, description, user }: TopbarProps) {
  return (
    <header className="h-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Voir le site</span>
        </Link>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Connecté :</span>
          <span className="font-bold text-slate-900">{user.prenom} {user.nom}</span>
        </div>
      </div>
    </header>
  );
}
