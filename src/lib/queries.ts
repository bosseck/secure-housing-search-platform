import { db } from "@/db";
import { advertisers, listings, reports } from "@/db/schema";
import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import type { ListingWithAdvertiser } from "@/lib/types";

export type ListingFilters = {
  q?: string;
  type?: string;
  maxPrice?: number;
  minSurface?: number;
  verifiedOnly?: boolean;
};

export async function getListings(
  filters: ListingFilters = {}
): Promise<ListingWithAdvertiser[]> {
  const conditions = [];

  if (filters.q) {
    conditions.push(
      or(
        ilike(listings.city, `%${filters.q}%`),
        ilike(listings.district, `%${filters.q}%`),
        ilike(listings.title, `%${filters.q}%`)
      )
    );
  }
  if (filters.type) conditions.push(eq(listings.propertyType, filters.type));
  if (filters.maxPrice)
    conditions.push(lte(listings.price, filters.maxPrice));
  if (filters.minSurface)
    conditions.push(gte(listings.surface, filters.minSurface));
  if (filters.verifiedOnly)
    conditions.push(eq(listings.status, "verifiee"));

  const rows = await db
    .select()
    .from(listings)
    .innerJoin(advertisers, eq(listings.advertiserId, advertisers.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      sql`CASE ${listings.status} WHEN 'verifiee' THEN 0 WHEN 'en_attente' THEN 1 ELSE 2 END`,
      desc(listings.createdAt)
    );

  return rows.map(({ listings: l, advertisers: a }) => ({
    ...l,
    advertiser: {
      id: a.id,
      name: a.name,
      kind: a.kind,
      email: a.email,
      phone: a.phone,
      company: a.company,
      verificationStatus: a.verificationStatus,
      verifiedAt: a.verifiedAt,
    },
  }));
}

export async function getListingById(id: number) {
  const all = await getListings();
  const listing = all.find((l) => l.id === id);
  if (!listing) return null;
  const listingReports = await db
    .select()
    .from(reports)
    .where(eq(reports.listingId, id))
    .orderBy(desc(reports.createdAt));
  return { listing, reports: listingReports };
}

export async function getStats() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      verified: sql<number>`count(*) filter (where ${listings.status} = 'verifiee')::int`,
      suspended: sql<number>`count(*) filter (where ${listings.status} = 'suspendue')::int`,
    })
    .from(listings);
  const [rep] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(reports);
  return { ...row, reports: rep.total };
}