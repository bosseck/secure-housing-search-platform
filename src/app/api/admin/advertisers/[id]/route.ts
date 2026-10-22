import { NextResponse } from "next/server";
import { db } from "@/db";
import { advertisers, listings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action, note } = await req.json();

  if (action !== "verifier" && action !== "rejeter") {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }

  const [updated] = await db
    .update(advertisers)
    .set({
      verificationStatus: action === "verifier" ? "verifie" : "rejete",
      verificationNote: note ? String(note) : null,
      verifiedAt: action === "verifier" ? new Date() : null,
    })
    .where(eq(advertisers.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Annonceur introuvable." }, { status: 404 });
  }

  if (action === "verifier") {
    // Les annonces en attente d'un annonceur vérifié passent en « vérifiée »
    await db
      .update(listings)
      .set({ status: "verifiee" })
      .where(eq(listings.advertiserId, updated.id));
  } else {
    await db
      .update(listings)
      .set({ status: "suspendue" })
      .where(eq(listings.advertiserId, updated.id));
  }

  return NextResponse.json({ ok: true });
}