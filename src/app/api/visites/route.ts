import { NextResponse } from "next/server";
import { db } from "@/db";
import { visitRequests, listings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { listingId, name, email, phone, preferredDate, message } =
      await req.json();

    if (!listingId || !name || !email || !preferredDate) {
      return NextResponse.json(
        { error: "Nom, e-mail et date souhaitée sont obligatoires." },
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
    if (listing.status === "suspendue") {
      return NextResponse.json(
        { error: "Cette annonce est suspendue : les visites sont bloquées." },
        { status: 403 }
      );
    }

    await db.insert(visitRequests).values({
      listingId: listing.id,
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : null,
      preferredDate: String(preferredDate),
      message: message ? String(message) : "",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}