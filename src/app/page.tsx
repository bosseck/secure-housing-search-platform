import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShieldCheck,
  BadgeCheck,
  Flag,
  Lock,
  FileCheck2,
  Eye,
  History,
  ArrowRight,
  MapPin,
  SlidersHorizontal,
  AlertTriangle,
} from "lucide-react";
import { getListings, getStats } from "@/lib/queries";
import { PROPERTY_TYPES } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

const tickerMessages = [
  "Aucun paiement avant la visite",
  "Identité des annonceurs contrôlée",
  "Localisation approximative pour votre sécurité",
  "Historique public des signalements",
  "Suspension automatique des annonces suspectes",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters = {
    q: sp.q || "",
    type: sp.type || "",
    maxPrice: sp.prix ? Number(sp.prix) : undefined,
    minSurface: sp.surface ? Number(sp.surface) : undefined,
    verifiedOnly: sp.verifie === "1",
  };
  const [results, stats] = await Promise.all([
    getListings(filters),
    getStats(),
  ]);

  const heroListing = results.find((l) => l.status === "verifiee") ?? results[0];

  return (
    <>
      {/* Bandeau défilant de règles de sécurité */}
      <div className="overflow-hidden border-b border-pine-deep/20 bg-pine-deep py-2 text-white">
        <div className="ticker-track flex w-max gap-10 whitespace-nowrap text-xs font-medium tracking-wide">
          {[...tickerMessages, ...tickerMessages].map((m, i) => (
            <span key={i} className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-saffron" /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 80% 10%, rgba(23,87,63,0.10), transparent), radial-gradient(ellipse 40% 40% at 10% 90%, rgba(232,161,60,0.12), transparent), linear-gradient(rgba(18,43,34,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(18,43,34,0.045) 1px, transparent 1px)",
            backgroundSize: "auto, auto, 44px 44px, 44px 44px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-pine/25 bg-moss px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
              <BadgeCheck size={14} /> Annonces immobilières contrôlées
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              Un logement,
              <br />
              <span className="relative inline-block text-pine">
                pas un piège.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9 C 60 3, 240 3, 297 8"
                    stroke="#e8a13c"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              LogementSûr regroupe des annonces <strong>vérifiées une à une</strong> :
              identité de l&apos;annonceur contrôlée, photos authentiques,
              signalements tracés. Cherchez, visitez, emménagez — l&apos;esprit tranquille.
            </p>

            {/* Recherche principale */}
            <form
              action="/#annonces"
              className="mt-8 flex max-w-xl flex-col gap-2 rounded-xl border border-line bg-card p-2 shadow-[0_16px_40px_-24px_rgba(18,43,34,0.4)] sm:flex-row"
            >
              <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5">
                <MapPin size={18} className="shrink-0 text-pine" />
                <input
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Ville, quartier… (ex : Lyon)"
                  className="w-full bg-transparent text-sm placeholder:text-ink/40"
                />
              </label>
              <select
                name="type"
                defaultValue={filters.type}
                className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink/80"
                aria-label="Type de bien"
              >
                <option value="">Tous les types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary">
                <Search size={16} /> Rechercher
              </button>
            </form>

            {/* Statistiques vivantes */}
            <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-line rounded-xl border border-line bg-card">
              {[
                { n: stats.verified, label: "annonces vérifiées", icon: ShieldCheck },
                { n: stats.reports, label: "signalements traités", icon: Flag },
                { n: stats.suspended, label: "fraudes stoppées", icon: Lock },
              ].map((s) => (
                <div key={s.label} className="px-4 py-4 text-center sm:px-5">
                  <dt className="sr-only">{s.label}</dt>
                  <s.icon size={16} className="mx-auto text-saffron" />
                  <dd className="mt-1 font-display text-3xl font-semibold text-pine">
                    {s.n}
                  </dd>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* Carte héro avec tampon */}
          {heroListing && (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl border-2 border-dashed border-pine/30" />
              <Link
                href={`/annonces/${heroListing.id}`}
                className="listing-card relative block overflow-hidden rounded-2xl border border-line bg-card shadow-xl"
              >
                <div className="relative h-72 overflow-hidden sm:h-80">
                  <Image
                    src={heroListing.photos[0]}
                    alt={heroListing.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="card-photo object-cover"
                  />
                  <div className="stamp absolute right-4 top-4 rounded-lg border-[3px] border-pine bg-white/85 px-4 py-2 font-display text-lg font-bold uppercase tracking-widest text-pine backdrop-blur-sm">
                    ✓ Vérifiée
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-display text-lg font-semibold">{heroListing.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink/60">
                      <MapPin size={14} className="text-saffron" />
                      {heroListing.district}, {heroListing.city}
                    </p>
                  </div>
                  <p className="font-display text-2xl font-semibold text-pine">
                    {heroListing.price} €
                    <span className="block text-right text-xs font-sans font-normal text-ink/50">par mois</span>
                  </p>
                </div>
              </Link>
              <div className="float-soft absolute -left-6 bottom-20 hidden items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 shadow-lg sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss text-pine">
                  <FileCheck2 size={17} />
                </span>
                <div className="text-xs">
                  <p className="font-semibold">Identité contrôlée</p>
                  <p className="text-ink/55">Pièce d&apos;identité + titre de propriété</p>
                </div>
              </div>
              <div
                className="float-soft absolute -right-3 -bottom-5 hidden items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 shadow-lg sm:flex"
                style={{ animationDelay: "1.6s" }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-soft text-[#8a5a10]">
                  <Lock size={17} />
                </span>
                <div className="text-xs">
                  <p className="font-semibold">0 € avant la visite</p>
                  <p className="text-ink/55">Paiement anticipé = arnaque</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RÉSULTATS */}
      <section id="annonces" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-ink/80 pt-6">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Les logements disponibles
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                {results.length} annonce{results.length > 1 ? "s" : ""} · les annonces vérifiées apparaissent en premier
              </p>
            </div>
            <Link href="/publier" className="btn-ghost text-sm">
              Publier une annonce <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        {/* Filtres */}
        <Reveal delay={80}>
          <form
            action="/#annonces"
            className="mt-6 grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto]"
          >
            <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3">
              <Search size={15} className="shrink-0 text-ink/40" />
              <input
                name="q"
                defaultValue={filters.q}
                placeholder="Ville ou quartier"
                className="w-full py-2.5 text-sm placeholder:text-ink/40"
              />
            </label>
            <select name="type" defaultValue={filters.type} className="field" aria-label="Type de bien">
              <option value="">Tous les types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select name="prix" defaultValue={sp.prix ?? ""} className="field" aria-label="Loyer maximum">
              <option value="">Loyer max : tous</option>
              <option value="500">≤ 500 €</option>
              <option value="800">≤ 800 €</option>
              <option value="1200">≤ 1 200 €</option>
              <option value="2000">≤ 2 000 €</option>
            </select>
            <select name="surface" defaultValue={sp.surface ?? ""} className="field" aria-label="Surface minimale">
              <option value="">Surface min : toutes</option>
              <option value="20">≥ 20 m²</option>
              <option value="40">≥ 40 m²</option>
              <option value="60">≥ 60 m²</option>
              <option value="80">≥ 80 m²</option>
            </select>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-medium">
              <input
                type="checkbox"
                name="verifie"
                value="1"
                defaultChecked={filters.verifiedOnly}
                className="h-4 w-4 accent-[#17573f]"
              />
              <ShieldCheck size={15} className="text-pine" /> Vérifiées
            </label>
            <button type="submit" className="btn-primary">
              <SlidersHorizontal size={15} /> Filtrer
            </button>
          </form>
        </Reveal>

        {results.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line bg-card p-14 text-center">
            <Search size={32} className="mx-auto text-ink/25" />
            <p className="mt-4 font-display text-xl font-semibold">Aucune annonce ne correspond</p>
            <p className="mt-1 text-sm text-ink/60">Essayez d&apos;élargir vos critères de recherche.</p>
            <Link href="/#annonces" className="btn-ghost mt-6">Réinitialiser les filtres</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) * 90}>
                <ListingCard listing={l} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* PROCÉDURE DE VÉRIFICATION */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
                Notre innovation
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
                Une procédure de vérification en 4 étapes,
                <span className="text-pine"> et un historique public.</span>
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-ink/70">
                Contrairement aux plateformes classiques, aucune annonce n&apos;est
                publiée sans contrôle humain. Chaque signalement est conservé,
                traité et visible — la transparence protège tout le monde.
              </p>
              <Link href="/verification" className="btn-primary mt-8">
                Découvrir la procédure <ArrowRight size={16} />
              </Link>
              <div className="mt-10 rounded-xl border border-alert/25 bg-alert-soft p-5">
                <p className="flex items-center gap-2 font-semibold text-alert">
                  <AlertTriangle size={17} /> Le saviez-vous ?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
                  Une demande de paiement <strong>avant la visite</strong> (mandat cash,
                  coupons PCS, virement « pour réserver ») est le signal n°1
                  d&apos;une fraude. Sur LogementSûr, elle entraîne une suspension immédiate.
                </p>
              </div>
            </div>
          </Reveal>

          <ol className="relative space-y-6 border-l-2 border-dashed border-pine/30 pl-8">
            {[
              {
                icon: FileCheck2,
                title: "Dossier de l'annonceur",
                text: "Pièce d'identité, justificatif de propriété ou mandat de gestion, SIRET pour les agences. Sans dossier complet, pas de publication.",
              },
              {
                icon: Eye,
                title: "Contrôle de l'annonce",
                text: "Notre équipe vérifie la cohérence du prix avec le marché, l'authenticité des photos et la description du logement.",
              },
              {
                icon: ShieldCheck,
                title: "Badge « Vérifiée »",
                text: "L'annonce reçoit son badge vert et l'annonceur son badge d'identité vérifiée. La localisation reste volontairement approximative.",
              },
              {
                icon: History,
                title: "Surveillance continue",
                text: "Chaque signalement est horodaté et conservé dans un historique. À partir de 3 signalements, l'annonce est suspendue automatiquement.",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <li className="relative rounded-xl border border-line bg-card p-6 transition hover:border-pine/40 hover:shadow-md">
                  <span className="absolute -left-[3.05rem] top-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-pine bg-paper font-display text-sm font-bold text-pine">
                    {i + 1}
                  </span>
                  <step.icon size={22} className="text-saffron" />
                  <h3 className="mt-3 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA SIGNALEMENT */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-pine-deep px-8 py-12 text-white sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
                  <Flag size={14} /> Vous êtes notre meilleur rempart
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                  Une annonce suspecte ? Signalez-la en 30 secondes.
                </h2>
                <p className="mt-3 text-white/70">
                  Chaque annonce dispose d&apos;un bouton de signalement. Votre alerte
                  est examinée par la modération et rejoint l&apos;historique public de transparence.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/#annonces"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-saffron px-6 py-3.5 text-sm font-bold text-pine-deep transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Search size={16} /> Parcourir les annonces
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <History size={16} /> Historique des signalements
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}