import type { Listing, Advertiser } from "@/db/schema";

export type ListingWithAdvertiser = Listing & {
  advertiser: Pick<
    Advertiser,
    | "id"
    | "name"
    | "kind"
    | "email"
    | "phone"
    | "company"
    | "verificationStatus"
    | "verifiedAt"
  >;
};

export const PROPERTY_TYPES = [
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "studio", label: "Studio" },
  { value: "chambre", label: "Chambre" },
] as const;

export const REPORT_REASONS = [
  "Demande de paiement avant visite",
  "Prix anormalement bas",
  "Photos volées ou trompeuses",
  "Annonceur injoignable ou suspect",
  "Logement inexistant à l'adresse",
  "Autre comportement suspect",
] as const;

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " €";
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}