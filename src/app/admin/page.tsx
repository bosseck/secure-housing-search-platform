"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Home,
  Flag,
  CalendarCheck,
  LoaderCircle,
  RefreshCw,
  FileCheck2,
  FileX2,
  ExternalLink,
  History,
} from "lucide-react";
import { formatDateTime, formatPrice } from "@/lib/types";
import { ListingStatusBadge, AdvertiserBadge } from "@/components/StatusBadge";

type Data = {
  advertisers: {
    id: number;
    name: string;
    kind: string;
    email: string;
    phone: string;
    company: string | null;
    siret: string | null;
    idDocumentProvided: boolean;
    ownershipProofProvided: boolean;
    verificationStatus: string;
    verificationNote: string | null;
    createdAt: string;
  }[];
  listings: {
    id: number;
    title: string;
    city: string;
    price: number;
    status: string;
    reportCount: number;
    advertiserId: number;
    createdAt: string;
  }[];
  reports: {
    id: number;
    listingId: number;
    listingTitle: string;
    listingCity: string;
    reason: string;
    details: string;
    reporterEmail: string | null;
    status: string;
    resolutionNote: string | null;
    createdAt: string;
    resolvedAt: string | null;
  }[];
  visits: {
    id: number;
    name: string;
    email: string;
    preferredDate: string;
    status: string;
    listingTitle: string;
    createdAt: string;
  }[];
};

const tabs = [
  { key: "annonceurs", label: "Annonceurs", icon: Users },
  { key: "annonces", label: "Annonces", icon: Home },
  { key: "signalements", label: "Signalements", icon: Flag },
  { key: "visites", label: "Visites", icon: CalendarCheck },
] as const;

const reportStatus: Record<string, { label: string; cls: string }> = {
  ouvert: { label: "Ouvert", cls: "bg-alert-soft text-alert" },
  en_cours: { label: "Enquête en cours", cls: "bg-saffron-soft text-[#8a5a10]" },
  confirme: { label: "Fraude confirmée", cls: "bg-alert text-white" },
  classe_sans_suite: { label: "Classé sans suite", cls: "bg-moss text-pine" },
};

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("annonceurs");
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    setData(await res.json());
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/data", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: Data) => {
        if (!cancelled) setData(json);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function act(
    url: string,
    body: Record<string, unknown>,
    id: number
  ) {
    setBusy(id);
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await load();
    setBusy(null);
  }

  const pendingAdv =
    data?.advertisers.filter((a) => a.verificationStatus === "en_attente").length ?? 0;
  const openReports =
    data?.reports.filter((r) => r.status === "ouvert" || r.status === "en_cours").length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
            Espace modération · démonstration
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">
            Centre de contrôle
          </h1>
          <p className="mt-2 max-w-2xl text-ink/65">
            Vérifiez les dossiers des annonceurs, traitez les signalements et
            suivez l&apos;historique complet. Chaque action est répercutée
            immédiatement sur le site.
          </p>
        </div>
        <button onClick={load} className="btn-ghost">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Indicateurs */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Dossiers à vérifier", value: pendingAdv, icon: FileCheck2, alert: pendingAdv > 0 },
          { label: "Signalements actifs", value: openReports, icon: Flag, alert: openReports > 0 },
          { label: "Annonces en ligne", value: data?.listings.filter((l) => l.status !== "suspendue").length ?? 0, icon: Home, alert: false },
          { label: "Demandes de visite", value: data?.visits.length ?? 0, icon: CalendarCheck, alert: false },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.alert ? "border-saffron/60 bg-saffron-soft" : "border-line bg-card"}`}>
            <s.icon size={18} className={s.alert ? "text-[#8a5a10]" : "text-pine"} />
            <p className="mt-2 font-display text-3xl font-semibold">{data ? s.value : "—"}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-line pb-px">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "border border-b-0 border-line bg-card text-pine"
                : "text-ink/55 hover:text-ink"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="flex justify-center py-24 text-pine">
          <LoaderCircle size={32} className="animate-spin" />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {/* ANNONCEURS */}
          {tab === "annonceurs" &&
            data.advertisers.map((a) => (
              <div key={a.id} className="rounded-xl border border-line bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <p className="font-semibold">{a.company || a.name}</p>
                      <AdvertiserBadge status={a.verificationStatus} />
                    </div>
                    <p className="mt-1 text-sm text-ink/60">
                      {a.kind === "agence" ? "Agence" : "Particulier"} · {a.email} · {a.phone}
                      {a.siret && ` · SIRET ${a.siret}`}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${a.idDocumentProvided ? "bg-moss text-pine" : "bg-alert-soft text-alert"}`}>
                        {a.idDocumentProvided ? <FileCheck2 size={12} /> : <FileX2 size={12} />} Pièce d&apos;identité
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${a.ownershipProofProvided ? "bg-moss text-pine" : "bg-alert-soft text-alert"}`}>
                        {a.ownershipProofProvided ? <FileCheck2 size={12} /> : <FileX2 size={12} />} Justificatif de propriété
                      </span>
                      <span className="rounded-full bg-paper px-2.5 py-1 text-ink/50">
                        Dossier du {formatDateTime(a.createdAt)}
                      </span>
                    </div>
                  </div>
                  {a.verificationStatus === "en_attente" && (
                    <div className="flex gap-2">
                      <button
                        disabled={busy === a.id}
                        onClick={() => act(`/api/admin/advertisers/${a.id}`, { action: "verifier", note: "Dossier complet : identité et propriété confirmées." }, a.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-pine px-4 py-2 text-sm font-semibold text-white transition hover:bg-pine-deep disabled:opacity-50"
                      >
                        {busy === a.id ? <LoaderCircle size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                        Vérifier
                      </button>
                      <button
                        disabled={busy === a.id}
                        onClick={() => act(`/api/admin/advertisers/${a.id}`, { action: "rejeter", note: "Documents non conformes." }, a.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-alert/40 px-4 py-2 text-sm font-semibold text-alert transition hover:bg-alert hover:text-white disabled:opacity-50"
                      >
                        <ShieldAlert size={14} /> Rejeter
                      </button>
                    </div>
                  )}
                </div>
                {a.verificationNote && (
                  <p className="mt-3 rounded-lg bg-moss/60 p-2.5 text-xs text-pine">
                    <strong>Note :</strong> {a.verificationNote}
                  </p>
                )}
              </div>
            ))}

          {/* ANNONCES */}
          {tab === "annonces" &&
            data.listings.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-card p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link href={`/annonces/${l.id}`} className="font-semibold hover:text-pine">
                      {l.title} <ExternalLink size={12} className="inline text-ink/40" />
                    </Link>
                    <ListingStatusBadge status={l.status} />
                    {l.reportCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-alert-soft px-2.5 py-1 text-[11px] font-semibold text-alert">
                        <Flag size={11} /> {l.reportCount}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {l.city} · {formatPrice(l.price)}/mois · publiée le {formatDateTime(l.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {l.status !== "verifiee" && (
                    <button
                      disabled={busy === l.id}
                      onClick={() => act(`/api/admin/listings/${l.id}`, { status: "verifiee" }, l.id)}
                      className="rounded-lg bg-pine px-3.5 py-2 text-xs font-semibold text-white hover:bg-pine-deep disabled:opacity-50"
                    >
                      Marquer vérifiée
                    </button>
                  )}
                  {l.status !== "suspendue" ? (
                    <button
                      disabled={busy === l.id}
                      onClick={() => act(`/api/admin/listings/${l.id}`, { status: "suspendue" }, l.id)}
                      className="rounded-lg border border-alert/40 px-3.5 py-2 text-xs font-semibold text-alert hover:bg-alert hover:text-white disabled:opacity-50"
                    >
                      Suspendre
                    </button>
                  ) : (
                    <button
                      disabled={busy === l.id}
                      onClick={() => act(`/api/admin/listings/${l.id}`, { status: "en_attente" }, l.id)}
                      className="rounded-lg border border-line px-3.5 py-2 text-xs font-semibold text-ink/70 hover:border-pine hover:text-pine disabled:opacity-50"
                    >
                      Réactiver
                    </button>
                  )}
                </div>
              </div>
            ))}

          {/* SIGNALEMENTS */}
          {tab === "signalements" && (
            <>
              <p className="flex items-center gap-2 rounded-lg bg-moss/70 p-3 text-sm text-pine">
                <History size={15} /> Historique intégral : aucun signalement n&apos;est supprimé, y compris après traitement.
              </p>
              {data.reports.length === 0 && (
                <p className="py-10 text-center text-ink/50">Aucun signalement pour le moment.</p>
              )}
              {data.reports.map((r) => {
                const st = reportStatus[r.status] ?? reportStatus.ouvert;
                return (
                  <div key={r.id} className="rounded-xl border border-line bg-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <p className="font-semibold">{r.reason}</p>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
                        </div>
                        <p className="mt-1 text-sm text-ink/60">
                          Annonce :{" "}
                          <Link href={`/annonces/${r.listingId}`} className="font-medium text-pine hover:underline">
                            {r.listingTitle}
                          </Link>{" "}
                          ({r.listingCity}) · {formatDateTime(r.createdAt)}
                          {r.reporterEmail && ` · ${r.reporterEmail}`}
                        </p>
                        {r.details && <p className="mt-2 text-sm text-ink/75">« {r.details} »</p>}
                        {r.resolutionNote && (
                          <p className="mt-2 rounded-lg bg-moss/60 p-2.5 text-xs text-pine">
                            <strong>Modération :</strong> {r.resolutionNote}
                            {r.resolvedAt && ` — ${formatDateTime(r.resolvedAt)}`}
                          </p>
                        )}
                      </div>
                      {(r.status === "ouvert" || r.status === "en_cours") && (
                        <div className="flex flex-wrap gap-2">
                          {r.status === "ouvert" && (
                            <button
                              disabled={busy === r.id}
                              onClick={() => act(`/api/admin/reports/${r.id}`, { action: "en_cours" }, r.id)}
                              className="rounded-lg border border-saffron bg-saffron-soft px-3.5 py-2 text-xs font-semibold text-[#8a5a10] hover:brightness-95 disabled:opacity-50"
                            >
                              Ouvrir l&apos;enquête
                            </button>
                          )}
                          <button
                            disabled={busy === r.id}
                            onClick={() => act(`/api/admin/reports/${r.id}`, { action: "confirme", note: "Fraude avérée après enquête. Annonce suspendue." }, r.id)}
                            className="rounded-lg bg-alert px-3.5 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-50"
                          >
                            Confirmer la fraude
                          </button>
                          <button
                            disabled={busy === r.id}
                            onClick={() => act(`/api/admin/reports/${r.id}`, { action: "classe_sans_suite", note: "Vérifications effectuées : aucun élément frauduleux." }, r.id)}
                            className="rounded-lg border border-line px-3.5 py-2 text-xs font-semibold text-ink/70 hover:border-pine hover:text-pine disabled:opacity-50"
                          >
                            Classer sans suite
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* VISITES */}
          {tab === "visites" && (
            <>
              {data.visits.length === 0 && (
                <p className="py-10 text-center text-ink/50">Aucune demande de visite pour le moment.</p>
              )}
              {data.visits.map((v) => (
                <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-5">
                  <div>
                    <p className="font-semibold">
                      {v.name} <span className="font-normal text-ink/55">· {v.email}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink/60">
                      {v.listingTitle} · souhaitée le <strong>{v.preferredDate}</strong> · reçue le {formatDateTime(v.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-pine">
                    Transmise à l&apos;annonceur
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}