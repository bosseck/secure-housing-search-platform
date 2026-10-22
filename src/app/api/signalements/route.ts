import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports, listings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { listingId, reason, details, reporterEmail } = await req.json();

    if (!listingId || !reason) {
      return NextResponse.json(
        { error: "Veuillez choisir un motif de signalement." },
        { status: 400 }
      );
    }

    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, Number(listingId)));

    if (!listing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    await db.insert(reports).values({
      listingId: listing.id,
      reason: String(reason),
      details: details ? String(details) : "",
      reporterEmail: reporterEmail ? String(reporterEmail) : null,
    });

    const [updated] = await db
      .update(listings)
      .set({ reportCount: sql`${listings.reportCount} + 1` })
      .where(eq(listings.id, listing.id))
      .returning();

    // Suspension automatique de précaution à partir de 3 signalements ouverts
    if (updated.reportCount >= 3 && updated.status !== "suspendue") {
      await db
        .update(listings)
        .set({ status: "suspendue" })
        .where(eq(listings.id, listing.id));
    }

    return NextResponse.json({
      ok: true,
      suspended: updated.reportCount >= 3,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}