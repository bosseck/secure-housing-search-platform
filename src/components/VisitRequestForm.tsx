"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, Lock, LoaderCircle } from "lucide-react";

export default function VisitRequestForm({ listingId }: { listingId: number }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/visites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        preferredDate: fd.get("preferredDate"),
        message: fd.get("message"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setState("idle");
      return;
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-pine/30 bg-moss p-6 text-center">
        <CheckCircle2 size={36} className="mx-auto text-pine" />
        <h3 className="mt-3 font-display text-xl font-semibold text-pine">
          Demande de visite envoyée !
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          L&apos;annonceur vous recontactera par e-mail pour confirmer le créneau.
          <strong> Rappel : ne réglez rien avant d&apos;avoir visité le logement et signé le bail.</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Votre nom *" className="field" />
        <input name="email" type="email" required placeholder="Votre e-mail *" className="field" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="phone" placeholder="Téléphone (optionnel)" className="field" />
        <input name="preferredDate" type="date" required className="field" aria-label="Date souhaitée" />
      </div>
      <textarea
        name="message"
        rows={3}
        placeholder="Votre message (situation, disponibilités…)"
        className="field resize-none"
      />
      {error && <p className="text-sm font-medium text-alert">{error}</p>}
      <button type="submit" disabled={state === "loading"} className="btn-primary w-full">
        {state === "loading" ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <CalendarCheck size={16} />
        )}
        Demander une visite gratuite
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink/50">
        <Lock size={12} /> Aucun paiement n&apos;est demandé ni autorisé avant la visite.
      </p>
    </form>
  );
}