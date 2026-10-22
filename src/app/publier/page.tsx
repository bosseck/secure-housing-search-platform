"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserRound,
  Home,
  FileCheck2,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/types";

const samplePhotos = [
  "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7167073/pexels-photo-7167073.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/6489096/pexels-photo-6489096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/17741459/pexels-photo-17741459.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

export default function PublierPage() {
  const [kind, setKind] = useState("particulier");
  const [photos, setPhotos] = useState<string[]>([samplePhotos[0]]);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [newId, setNewId] = useState<number | null>(null);

  function togglePhoto(url: string) {
    setPhotos((p) =>
      p.includes(url) ? p.filter((x) => x !== url) : [...p, url].slice(0, 4)
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        advertiserName: fd.get("advertiserName"),
        advertiserKind: kind,
        advertiserEmail: fd.get("advertiserEmail"),
        advertiserPhone: fd.get("advertiserPhone"),
        company: fd.get("company"),
        siret: fd.get("siret"),
        idDocumentProvided: fd.get("idDocument") === "on",
        ownershipProofProvided: fd.get("ownershipProof") === "on",
        title: fd.get("title"),
        description: fd.get("description"),
        propertyType: fd.get("propertyType"),
        city: fd.get("city"),
        district: fd.get("district"),
        price: fd.get("price"),
        chargesIncluded: fd.get("chargesIncluded") === "on",
        depositMonths: fd.get("depositMonths"),
        surface: fd.get("surface"),
        rooms: fd.get("rooms"),
        furnished: fd.get("furnished") === "on",
        availableFrom: fd.get("availableFrom"),
        conditions: fd.get("conditions"),
        photos,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setState("idle");
      return;
    }
    setNewId(data.listingId);
    setState("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-moss">
          <CheckCircle2 size={40} className="text-pine" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold">
          Annonce soumise à vérification !
        </h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          Votre dossier (identité + justificatif de propriété) est transmis à
          notre équipe de modération. Votre annonce est visible avec le badge
          <strong> « Vérification en cours »</strong> et recevra le badge
          <strong> « Vérifiée »</strong> après contrôle, sous 24 à 48 h.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {newId && (
            <Link href={`/annonces/${newId}`} className="btn-primary">
              Voir mon annonce <ArrowRight size={16} />
            </Link>
          )}
          <Link href="/admin" className="btn-ghost">
            Suivre dans l&apos;espace modération (démo)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
        Propriétaires & agences
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        Publier une annonce contrôlée
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
        Chaque annonce passe par notre procédure de vérification : dossier
        d&apos;identité, justificatif de propriété et contrôle du contenu.
        C&apos;est ce qui protège vos futurs locataires — et votre réputation.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-8">
        {/* Étape 1 : annonceur */}
        <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine font-sans text-sm font-bold text-white">1</span>
            <UserRound size={20} className="text-saffron" /> Vous êtes…
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { v: "particulier", label: "Un propriétaire particulier" },
              { v: "agence", label: "Une agence immobilière" },
            ].map((k) => (
              <button
                key={k.v}
                type="button"
                onClick={() => setKind(k.v)}
                className={`rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition ${
                  kind === k.v
                    ? "border-pine bg-moss text-pine"
                    : "border-line bg-white text-ink/60 hover:border-pine/40"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Nom complet *
              <input name="advertiserName" required className="field mt-1.5" placeholder="Ex : Claire Dubois" />
            </label>
            <label className="text-sm font-medium">
              Téléphone *
              <input name="advertiserPhone" required className="field mt-1.5" placeholder="06 12 34 56 78" />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              E-mail *
              <input name="advertiserEmail" type="email" required className="field mt-1.5" placeholder="vous@exemple.fr" />
            </label>
            {kind === "agence" && (
              <>
                <label className="text-sm font-medium">
                  Nom de l&apos;agence
                  <input name="company" className="field mt-1.5" placeholder="Agence du Centre" />
                </label>
                <label className="text-sm font-medium">
                  N° SIRET
                  <input name="siret" className="field mt-1.5" placeholder="123 456 789 00012" />
                </label>
              </>
            )}
          </div>
        </section>

        {/* Étape 2 : logement */}
        <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine font-sans text-sm font-bold text-white">2</span>
            <Home size={20} className="text-saffron" /> Le logement
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium sm:col-span-2">
              Titre de l&apos;annonce *
              <input name="title" required className="field mt-1.5" placeholder="Ex : T2 lumineux proche métro" />
            </label>
            <label className="text-sm font-medium">
              Type de bien *
              <select name="propertyType" required className="field mt-1.5" defaultValue="appartement">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Disponibilité
              <input name="availableFrom" className="field mt-1.5" placeholder="Ex : 1er mars 2026" />
            </label>
            <label className="text-sm font-medium">
              Ville *
              <input name="city" required className="field mt-1.5" placeholder="Lyon" />
            </label>
            <label className="text-sm font-medium">
              Quartier *
              <input name="district" required className="field mt-1.5" placeholder="Croix-Rousse" />
            </label>
            <label className="text-sm font-medium">
              Loyer mensuel (€) *
              <input name="price" type="number" min={1} required className="field mt-1.5" placeholder="750" />
            </label>
            <label className="text-sm font-medium">
              Dépôt de garantie (mois)
              <select name="depositMonths" className="field mt-1.5" defaultValue="1">
                <option value="0">Aucun</option>
                <option value="1">1 mois</option>
                <option value="2">2 mois</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Surface (m²) *
              <input name="surface" type="number" min={1} required className="field mt-1.5" placeholder="45" />
            </label>
            <label className="text-sm font-medium">
              Nombre de pièces *
              <input name="rooms" type="number" min={1} required className="field mt-1.5" placeholder="2" />
            </label>
            <label className="flex items-center gap-2.5 pt-6 text-sm font-medium">
              <input name="chargesIncluded" type="checkbox" className="h-4 w-4 accent-[#17573f]" />
              Charges comprises
            </label>
            <label className="flex items-center gap-2.5 pt-6 text-sm font-medium">
              <input name="furnished" type="checkbox" className="h-4 w-4 accent-[#17573f]" />
              Logement meublé
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              Description détaillée *
              <textarea
                name="description"
                required
                rows={5}
                className="field mt-1.5 resize-none"
                placeholder="Décrivez le logement, l'immeuble, les transports, les commerces…"
              />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              Conditions du bail
              <input name="conditions" className="field mt-1.5" placeholder="Ex : garant demandé, revenus 3× le loyer, animaux acceptés…" />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">Photos (démo : sélectionnez des visuels)</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {samplePhotos.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePhoto(p)}
                  className={`relative h-24 overflow-hidden rounded-lg border-2 transition ${
                    photos.includes(p) ? "border-pine shadow-md" : "border-line opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={p} alt="" fill sizes="25vw" className="object-cover" />
                  {photos.includes(p) && (
                    <CheckCircle2 size={20} className="absolute right-1.5 top-1.5 rounded-full bg-white text-pine" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Étape 3 : vérification */}
        <section className="rounded-2xl border-2 border-pine/30 bg-moss/50 p-6 sm:p-8">
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine font-sans text-sm font-bold text-white">3</span>
            <FileCheck2 size={20} className="text-saffron" /> Dossier de vérification
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Ces documents sont examinés par notre équipe et ne sont jamais
            publiés. Ils conditionnent l&apos;obtention du badge « Vérifiée ».
          </p>
          <div className="mt-5 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-card p-4">
              <input name="idDocument" type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#17573f]" />
              <span className="text-sm">
                <strong>Pièce d&apos;identité *</strong>
                <span className="mt-0.5 block text-ink/60">
                  Je certifie fournir une pièce d&apos;identité en cours de validité (CNI, passeport).
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-card p-4">
              <input name="ownershipProof" type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#17573f]" />
              <span className="text-sm">
                <strong>Justificatif de propriété ou mandat *</strong>
                <span className="mt-0.5 block text-ink/60">
                  Taxe foncière, titre de propriété ou mandat de gestion signé (agences).
                </span>
              </span>
            </label>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs font-medium text-pine">
            <ShieldCheck size={14} /> En publiant, vous vous engagez à ne jamais demander de paiement avant une visite réelle.
          </p>
        </section>

        {error && (
          <p className="rounded-lg bg-alert-soft p-4 text-sm font-semibold text-alert">{error}</p>
        )}

        <button type="submit" disabled={state === "loading"} className="btn-primary w-full py-4 text-base">
          {state === "loading" ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <ShieldCheck size={18} />
          )}
          Soumettre à la vérification
        </button>
      </form>
    </div>
  );
}