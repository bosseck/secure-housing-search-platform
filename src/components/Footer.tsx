import Link from "next/link";
import { ShieldCheck, Home, AlertTriangle, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-pine-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Home size={17} />
                <ShieldCheck
                  size={13}
                  className="absolute -right-1.5 -bottom-1.5 rounded-full bg-saffron p-[1px] text-pine-deep"
                />
              </span>
              <span className="font-display text-xl font-semibold">
                LogementSûr
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Rendre la recherche de logement plus transparente. Chaque
              annonceur est vérifié, chaque signalement est tracé, et aucun
              paiement n&apos;est demandé avant une visite réelle.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><Link className="hover:text-white" href="/">Rechercher un logement</Link></li>
              <li><Link className="hover:text-white" href="/verification">Procédure de vérification</Link></li>
              <li><Link className="hover:text-white" href="/publier">Publier une annonce</Link></li>
              <li><Link className="hover:text-white" href="/admin">Espace modération</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
              Règles d&apos;or
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-2.5">
                <Lock size={16} className="mt-0.5 shrink-0 text-saffron" />
                Ne payez jamais avant d&apos;avoir visité et signé.
              </li>
              <li className="flex gap-2.5">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-saffron" />
                Signalez toute demande de mandat cash ou de virement.
              </li>
              <li className="flex gap-2.5">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-saffron" />
                Privilégiez les annonces au badge « Vérifiée ».
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LogementSûr — Projet à impact social.</p>
          <p>Photos : Pexels. Données de démonstration.</p>
        </div>
      </div>
    </footer>
  );
}