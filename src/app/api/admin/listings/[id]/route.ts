import { NextResponse } from "next/server";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!["verifiee", "suspendue", "en_attente"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const [updated] = await db
    .update(listings)
    .set({ status })
    .where(eq(listings.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}