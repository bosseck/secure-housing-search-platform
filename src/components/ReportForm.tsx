"use client";

import { useState, type FormEvent } from "react";
import { Flag, X, CheckCircle2, LoaderCircle } from "lucide-react";
import { REPORT_REASONS } from "@/lib/types";

export default function ReportForm({ listingId }: { listingId: number }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/signalements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        reason: fd.get("reason"),
        details: fd.get("details"),
        reporterEmail: fd.get("reporterEmail"),
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

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setState("idle");
        }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-alert/40 bg-alert-soft px-4 py-2.5 text-sm font-semibold text-alert transition hover:bg-alert hover:text-white"
      >
        <Flag size={15} /> Signaler cette annonce
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-pine-deep/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-line bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  Signaler une annonce suspecte
                </h3>
                <p className="mt-1 text-sm text-ink/60">
                  Votre signalement est horodaté, examiné par la modération et
                  conservé dans l&apos;historique de transparence.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-ink/50 hover:bg-moss"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {state === "done" ? (
              <div className="mt-6 rounded-xl bg-moss p-6 text-center">
                <CheckCircle2 size={36} className="mx-auto text-pine" />
                <p className="mt-3 font-display text-lg font-semibold text-pine">
                  Merci, votre signalement a été enregistré.
                </p>
                <p className="mt-1.5 text-sm text-ink/65">
                  À partir de 3 signalements, l&apos;annonce est suspendue
                  automatiquement en attendant l&apos;enquête.
                </p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-5">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 space-y-3">
                <select name="reason" required className="field" defaultValue="">
                  <option value="" disabled>
                    Motif du signalement *
                  </option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Décrivez ce qui vous semble suspect (demande d'argent, incohérences…)"
                  className="field resize-none"
                />
                <input
                  name="reporterEmail"
                  type="email"
                  placeholder="Votre e-mail (optionnel, pour le suivi)"
                  className="field"
                />
                {error && <p className="text-sm font-medium text-alert">{error}</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-alert px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {state === "loading" ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Flag size={16} />
                  )}
                  Envoyer le signalement
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}