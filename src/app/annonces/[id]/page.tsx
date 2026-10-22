import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Ruler,
  BedDouble,
  Sofa,
  CalendarDays,
  Wallet,
  Receipt,
  FileText,
  Mail,
  Phone,
  Building2,
  User,
  ShieldCheck,
  History,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { getListingById } from "@/lib/queries";
import { formatPrice, formatDate, formatDateTime } from "@/lib/types";
import { ListingStatusBadge, AdvertiserBadge } from "@/components/StatusBadge";
import PhotoGallery from "@/components/PhotoGallery";
import ZoneMap from "@/components/ZoneMap";
import VisitRequestForm from "@/components/VisitRequestForm";
import ReportForm from "@/components/ReportForm";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

const reportStatusLabels: Record<string, { label: string; cls: string }> = {
  ouvert: { label: "En attente d'examen", cls: "bg-saffron-soft text-[#8a5a10]" },
  en_cours: { label: "Enquête en cours", cls: "bg-saffron-soft text-[#8a5a10]" },
  confirme: { label: "Fraude confirmée", cls: "bg-alert-soft text-alert" },
  classe_sans_suite: { label: "Classé sans suite", cls: "bg-moss text-pine" },
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getListingById(Number(id));
  if (!data) notFound();
  const { listing, reports } = data;
  const a = listing.advertiser;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href="/#annonces"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-pine"
      >
        <ArrowLeft size={16} /> Retour aux annonces
      </Link>

      {listing.status === "suspendue" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-alert/30 bg-alert-soft p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-alert" />
          <div>
            <p className="font-semibold text-alert">
              Cette annonce est suspendue par la modération.
            </p>
            <p className="mt-0.5 text-sm text-ink/70">
              Des signalements sont en cours d&apos;examen. Les demandes de visite
              sont bloquées et tout contact est déconseillé. Consultez
              l&apos;historique ci-dessous.
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ListingStatusBadge status={listing.status} size="lg" />
            {listing.reportCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-alert/30 px-3 py-1.5 text-xs font-semibold text-alert">
                <History size={13} /> {listing.reportCount} signalement
                {listing.reportCount > 1 ? "s" : ""} dans l&apos;historique
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-ink/60">
            <MapPin size={16} className="text-saffron" />
            {listing.district}, {listing.city} — localisation approximative
          </p>
        </div>
        <div className="rounded-xl border border-line bg-card px-6 py-4 text-right">
          <p className="font-display text-4xl font-semibold text-pine">
            {formatPrice(listing.price)}
          </p>
          <p className="text-sm text-ink/55">
            par mois · {listing.chargesIncluded ? "charges comprises" : "hors charges"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Colonne principale */}
        <div className="space-y-10">
          <PhotoGallery photos={listing.photos} title={listing.title} />

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Ruler, label: "Surface", value: `${listing.surface} m²` },
              { icon: BedDouble, label: "Pièces", value: String(listing.rooms) },
              { icon: Sofa, label: "Mobilier", value: listing.furnished ? "Meublé" : "Non meublé" },
              { icon: CalendarDays, label: "Disponible", value: listing.availableFrom },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-line bg-card p-4 text-center">
                <f.icon size={19} className="mx-auto text-pine" />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink/45">{f.label}</p>
                <p className="mt-0.5 text-sm font-semibold">{f.value}</p>
              </div>
            ))}
          </div>

          <Reveal>
            <section>
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                <FileText size={20} className="text-saffron" /> Description
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/75">
                {listing.description}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="rounded-xl border border-line bg-card p-6">
              <h2 className="font-display text-2xl font-semibold">Loyer & conditions</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Wallet size={18} className="mt-0.5 text-pine" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">Loyer mensuel</dt>
                    <dd className="font-semibold">{formatPrice(listing.price)} {listing.chargesIncluded ? "CC" : "HC"}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Receipt size={18} className="mt-0.5 text-pine" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">Dépôt de garantie</dt>
                    <dd className="font-semibold">
                      {listing.depositMonths === 0 ? "Aucun" : `${listing.depositMonths} mois (${formatPrice(listing.price * listing.depositMonths)})`}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="mt-0.5 text-pine" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink/45">Entrée dans les lieux</dt>
                    <dd className="font-semibold">{listing.availableFrom}</dd>
                  </div>
                </div>
              </dl>
              {listing.conditions && (
                <p className="mt-5 rounded-lg bg-moss/70 p-4 text-sm leading-relaxed text-ink/75">
                  <strong>Conditions du bail :</strong> {listing.conditions}
                </p>
              )}
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-saffron-soft p-3 text-xs font-medium text-[#8a5a10]">
                <ShieldCheck size={14} className="shrink-0" />
                Le dépôt de garantie se verse uniquement à la signature du bail, jamais avant la visite.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-2xl font-semibold">Localisation approximative</h2>
              <p className="mt-1 text-sm text-ink/60">
                Pour la sécurité de tous, l&apos;adresse exacte n&apos;est communiquée
                qu&apos;après confirmation de la visite.
              </p>
              <div className="mt-4">
                <ZoneMap city={listing.city} district={listing.district} seed={listing.id} />
              </div>
            </section>
          </Reveal>

          {/* Historique public des signalements */}
          <Reveal>
            <section className="rounded-xl border border-line bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                <History size={20} className="text-saffron" /> Historique de transparence
              </h2>
              {reports.length === 0 ? (
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-moss p-4 text-sm font-medium text-pine">
                  <ShieldCheck size={16} /> Aucun signalement enregistré pour cette annonce.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {reports.map((r) => {
                    const st = reportStatusLabels[r.status] ?? reportStatusLabels.ouvert;
                    return (
                      <li key={r.id} className="rounded-lg border border-line p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{r.reason}</p>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-ink/50">
                          Signalé le {formatDateTime(r.createdAt)}
                          {r.resolvedAt && ` · traité le ${formatDateTime(r.resolvedAt)}`}
                        </p>
                        {r.details && (
                          <p className="mt-2 text-sm text-ink/70">« {r.details} »</p>
                        )}
                        {r.resolutionNote && (
                          <p className="mt-2 rounded bg-moss/60 p-2 text-xs text-pine">
                            <strong>Modération :</strong> {r.resolutionNote}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </Reveal>
        </div>

        {/* Colonne latérale */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine text-white">
                {a.kind === "agence" ? <Building2 size={22} /> : <User size={22} />}
              </span>
              <div>
                <p className="font-semibold">{a.company || a.name}</p>
                <p className="text-xs text-ink/55">
                  {a.kind === "agence" ? "Agence immobilière" : "Propriétaire particulier"}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <AdvertiserBadge status={a.verificationStatus} />
            </div>
            {a.verifiedAt && (
              <p className="mt-2 text-xs text-ink/50">
                Identité contrôlée le {formatDate(a.verifiedAt)}
              </p>
            )}
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <a href={`mailto:${a.email}`} className="flex items-center gap-2.5 text-ink/75 transition hover:text-pine">
                <Mail size={15} className="text-pine" /> {a.email}
              </a>
              <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-ink/75 transition hover:text-pine">
                <Phone size={15} className="text-pine" /> {a.phone}
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Demander une visite</h2>
            <p className="mb-4 mt-1 text-sm text-ink/60">
              Gratuit et sans engagement.
            </p>
            {listing.status === "suspendue" ? (
              <p className="rounded-lg bg-alert-soft p-4 text-sm font-medium text-alert">
                Visites bloquées : cette annonce est suspendue suite à des signalements.
              </p>
            ) : (
              <VisitRequestForm listingId={listing.id} />
            )}
          </div>

          <ReportForm listingId={listing.id} />
        </aside>
      </div>
    </div>
  );
}