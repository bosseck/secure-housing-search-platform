import { NextResponse } from "next/server";
import { db } from "@/db";
import { advertisers, listings, reports, visitRequests } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const [advs, lsts, reps, visits] = await Promise.all([
    db.select().from(advertisers).orderBy(desc(advertisers.createdAt)),
    db.select().from(listings).orderBy(desc(listings.createdAt)),
    db
      .select({
        id: reports.id,
        listingId: reports.listingId,
        reason: reports.reason,
        details: reports.details,
        reporterEmail: reports.reporterEmail,
        status: reports.status,
        resolutionNote: reports.resolutionNote,
        createdAt: reports.createdAt,
        resolvedAt: reports.resolvedAt,
        listingTitle: listings.title,
        listingCity: listings.city,
      })
      .from(reports)
      .innerJoin(listings, eq(reports.listingId, listings.id))
      .orderBy(desc(reports.createdAt)),
    db
      .select({
        id: visitRequests.id,
        name: visitRequests.name,
        email: visitRequests.email,
        preferredDate: visitRequests.preferredDate,
        status: visitRequests.status,
        createdAt: visitRequests.createdAt,
        listingTitle: listings.title,
      })
      .from(visitRequests)
      .innerJoin(listings, eq(visitRequests.listingId, listings.id))
      .orderBy(desc(visitRequests.createdAt)),
  ]);

  return NextResponse.json({
    advertisers: advs,
    listings: lsts,
    reports: reps,
    visits,
  });
}