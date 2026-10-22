import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, BedDouble, Flag } from "lucide-react";
import { ListingStatusBadge } from "./StatusBadge";
import { formatPrice, type ListingWithAdvertiser } from "@/lib/types";

export default function ListingCard({
  listing,
}: {
  listing: ListingWithAdvertiser;
}) {
  return (
    <Link
      href={`/annonces/${listing.id}`}
      className="listing-card group block overflow-hidden rounded-xl border border-line bg-card"
    >
      <div className="relative h-52 overflow-hidden bg-moss">
        {listing.photos[0] ? (
          <Image
            src={listing.photos[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="card-photo object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/30">
            Photo à venir
          </div>
        )}
        <div className="absolute left-3 top-3">
          <ListingStatusBadge status={listing.status} />
        </div>
        {listing.reportCount > 0 && listing.status !== "suspendue" && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-alert">
            <Flag size={11} /> {listing.reportCount} signalement
            {listing.reportCount > 1 ? "s" : ""}
          </span>
        )}
        <div className="absolute bottom-3 left-3 rounded-lg bg-pine-deep/90 px-3 py-1.5 text-white backdrop-blur-sm">
          <span className="font-display text-lg font-semibold">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-white/75">
            {" "}/ mois {listing.chargesIncluded ? "CC" : "HC"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
          {listing.propertyType} · {listing.advertiser.kind === "agence" ? "Agence" : "Particulier"}
        </p>
        <h3 className="mt-1 line-clamp-1 font-display text-lg font-semibold leading-snug group-hover:text-pine">
          {listing.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/60">
          <MapPin size={14} className="shrink-0 text-saffron" />
          {listing.district}, {listing.city}
          <span className="text-ink/35">· zone approx.</span>
        </p>
        <div className="mt-3 flex items-center gap-4 border-t border-line pt-3 text-xs font-medium text-ink/70">
          <span className="flex items-center gap-1.5">
            <Ruler size={14} className="text-pine" /> {listing.surface} m²
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} className="text-pine" /> {listing.rooms} pièce
            {listing.rooms > 1 ? "s" : ""}
          </span>
          <span className="ml-auto rounded-full bg-moss px-2 py-0.5 text-[11px] text-pine">
            {listing.furnished ? "Meublé" : "Non meublé"}
          </span>
        </div>
      </div>
    </Link>
  );
}