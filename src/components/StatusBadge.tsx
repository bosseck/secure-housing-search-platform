import { ShieldCheck, Clock3, ShieldAlert } from "lucide-react";

export function ListingStatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "lg";
}) {
  const cls =
    size === "lg"
      ? "px-4 py-2 text-sm gap-2"
      : "px-2.5 py-1 text-[11px] gap-1.5";
  const icon = size === "lg" ? 16 : 13;

  if (status === "verifiee") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-pine font-semibold text-white shadow-sm ${cls}`}
      >
        <ShieldCheck size={icon} strokeWidth={2.5} /> Annonce vérifiée
      </span>
    );
  }
  if (status === "suspendue") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-alert font-semibold text-white shadow-sm ${cls}`}
      >
        <ShieldAlert size={icon} strokeWidth={2.5} /> Suspendue — signalée
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full bg-saffron-soft font-semibold text-[#8a5a10] ring-1 ring-saffron/60 ${cls}`}
    >
      <Clock3 size={icon} strokeWidth={2.5} /> Vérification en cours
    </span>
  );
}

export function AdvertiserBadge({ status }: { status: string }) {
  if (status === "verifie") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-moss px-2.5 py-1 text-[11px] font-semibold text-pine">
        <ShieldCheck size={13} strokeWidth={2.5} /> Identité vérifiée
      </span>
    );
  }
  if (status === "rejete") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-soft px-2.5 py-1 text-[11px] font-semibold text-alert">
        <ShieldAlert size={13} strokeWidth={2.5} /> Vérification refusée
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-soft px-2.5 py-1 text-[11px] font-semibold text-[#8a5a10]">
      <Clock3 size={13} strokeWidth={2.5} /> Dossier en cours
    </span>
  );
}