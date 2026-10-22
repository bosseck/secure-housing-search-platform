import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports, listings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action, note } = await req.json();

  const valid = ["en_cours", "confirme", "classe_sans_suite"];
  if (!valid.includes(action)) {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }

  const [report] = await db
    .select()
    .from(reports)
    .where(eq(reports.id, Number(id)));

  if (!report) {
    return NextResponse.json({ error: "Signalement introuvable." }, { status: 404 });
  }

  await db
    .update(reports)
    .set({
      status: action,
      resolutionNote: note ? String(note) : report.resolutionNote,
      resolvedAt:
        action === "confirme" || action === "classe_sans_suite"
          ? new Date()
          : null,
    })
    .where(eq(reports.id, report.id));

  if (action === "confirme") {
    // Fraude confirmée → suspension immédiate de l'annonce
    await db
      .update(listings)
      .set({ status: "suspendue" })
      .where(eq(listings.id, report.listingId));
  }

  return NextResponse.json({ ok: true });
}