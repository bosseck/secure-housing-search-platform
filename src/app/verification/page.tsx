import Link from "next/link";
import {
  FileCheck2,
  Eye,
  ShieldCheck,
  History,
  AlertTriangle,
  Banknote,
  Camera,
  PhoneOff,
  MapPinOff,
  ArrowRight,
} from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Procédure de vérification — LogementSûr",
};

const steps = [
  {
    icon: FileCheck2,
    title: "1 · Vérification de l'annonceur",
    points: [
      "Pièce d'identité en cours de validité, comparée au nom du dossier.",
      "Justificatif de propriété (taxe foncière, titre) ou mandat de gestion pour les agences.",
      "Numéro SIRET contrôlé pour les professionnels.",
      "Un annonceur refusé voit toutes ses annonces suspendues.",
    ],
  },
  {
    icon: Eye,
    title: "2 · Contrôle de chaque annonce",
    points: [
      "Analyse du prix par rapport au marché local : un loyer anormalement bas déclenche une enquête.",
      "Recherche d'image inversée pour détecter les photos volées.",
      "Cohérence entre description, surface, quartier et conditions du bail.",
      "La localisation est volontairement floutée à une zone d'environ 500 m.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "3 · Attribution du badge « Vérifiée »",
    points: [
      "Le badge vert n'apparaît qu'après validation humaine complète.",
      "Le badge « Vérification en cours » reste visible tant que le dossier n'est pas validé.",
      "Les demandes de visite sont possibles, mais aucun paiement n'est jamais autorisé.",
    ],
  },
  {
    icon: History,
    title: "4 · Surveillance & historique public",
    points: [
      "Chaque annonce dispose d'un bouton « Signaler » accessible à tous.",
      "Les signalements sont horodatés, traités par la modération et jamais supprimés.",
      "Suspension automatique dès 3 signalements, en attendant l'enquête.",
      "L'historique complet est consultable sur chaque annonce : fraude confirmée ou classement sans suite.",
    ],
  },
];

const redFlags = [
  {
    icon: Banknote,
    title: "Paiement avant visite",
    text: "Mandat cash, coupons PCS/Transcash, virement « pour réserver » : c'est une arnaque dans 100 % des cas.",
  },
  {
    icon: Camera,
    title: "Photos trop parfaites",
    text: "Des photos dignes d'un magazine pour un loyer dérisoire : vérifiez avec la recherche d'image inversée.",
  },
  {
    icon: PhoneOff,
    title: "Propriétaire « à l'étranger »",
    text: "Le scénario classique : impossible de visiter, mais il faut payer pour « recevoir les clés ».",
  },
  {
    icon: MapPinOff,
    title: "Adresse refusée",
    text: "Un annonceur légitime accepte toujours de situer le bien et d'organiser une visite physique.",
  },
];

export default function VerificationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
          Transparence totale
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Comment nous vérifions <span className="text-pine">chaque annonceur</span>,
          et pourquoi ça change tout.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          Les fausses annonces prospèrent sur l&apos;anonymat. Notre réponse :
          une procédure de vérification stricte en amont, et un historique des
          signalements consultable par tous en aval.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <article className="h-full rounded-2xl border border-line bg-card p-7 transition hover:border-pine/40 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-pine text-white">
                <s.icon size={22} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold">{s.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-saffron" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Statuts */}
      <Reveal>
        <section className="mt-16 rounded-2xl border border-line bg-card p-8">
          <h2 className="font-display text-3xl font-semibold">Lire les badges en un coup d&apos;œil</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-moss p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pine px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck size={13} /> Annonce vérifiée
              </span>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Dossier complet validé par la modération. Vous pouvez contacter et visiter sereinement.
              </p>
            </div>
            <div className="rounded-xl bg-saffron-soft p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8a5a10] ring-1 ring-saffron/60">
                Vérification en cours
              </span>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                L&apos;annonce est récente : le contrôle humain est en cours. Restez vigilant, aucun paiement.
              </p>
            </div>
            <div className="rounded-xl bg-alert-soft p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-alert px-3 py-1 text-xs font-semibold text-white">
                <AlertTriangle size={13} /> Suspendue
              </span>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Signalements en cours d&apos;enquête : visites bloquées, contact déconseillé. Historique public.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Signaux d'alerte */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-display text-3xl font-semibold">
            Les 4 signaux d&apos;alerte à connaître
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {redFlags.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="flex gap-4 rounded-xl border border-alert/20 bg-card p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-alert-soft text-alert">
                    <f.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-pine-deep p-10 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold">Prêt à chercher sereinement ?</h2>
            <p className="mt-2 text-white/70">Des logements contrôlés, des annonceurs identifiés, zéro paiement anticipé.</p>
          </div>
          <Link
            href="/#annonces"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-saffron px-6 py-3.5 text-sm font-bold text-pine-deep transition hover:brightness-110"
          >
            Voir les annonces <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}