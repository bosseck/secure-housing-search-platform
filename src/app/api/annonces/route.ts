import { NextResponse } from "next/server";
import { db } from "@/db";
import { advertisers, listings } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      advertiserName,
      advertiserKind,
      advertiserEmail,
      advertiserPhone,
      company,
      siret,
      idDocumentProvided,
      ownershipProofProvided,
      title,
      description,
      propertyType,
      city,
      district,
      price,
      chargesIncluded,
      depositMonths,
      surface,
      rooms,
      furnished,
      availableFrom,
      conditions,
      photos,
    } = body;

    if (
      !advertiserName ||
      !advertiserEmail ||
      !advertiserPhone ||
      !title ||
      !description ||
      !propertyType ||
      !city ||
      !district ||
      !price ||
      !surface ||
      !rooms
    ) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    if (!idDocumentProvided || !ownershipProofProvided) {
      return NextResponse.json(
        {
          error:
            "La pièce d'identité et le justificatif de propriété sont obligatoires pour la vérification.",
        },
        { status: 400 }
      );
    }

    const [advertiser] = await db
      .insert(advertisers)
      .values({
        name: String(advertiserName),
        kind: advertiserKind === "agence" ? "agence" : "particulier",
        email: String(advertiserEmail),
        phone: String(advertiserPhone),
        company: company ? String(company) : null,
        siret: siret ? String(siret) : null,
        idDocumentProvided: true,
        ownershipProofProvided: true,
        verificationStatus: "en_attente",
      })
      .returning();

    const photoList: string[] = Array.isArray(photos)
      ? photos.filter((p: unknown) => typeof p === "string" && p.startsWith("http"))
      : [];

    const [listing] = await db
      .insert(listings)
      .values({
        advertiserId: advertiser.id,
        title: String(title),
        description: String(description),
        propertyType: String(propertyType),
        city: String(city),
        district: String(district),
        approxZone: `Zone approximative de 500 m autour de ${district}, ${city}`,
        price: Math.max(1, Math.round(Number(price))),
        chargesIncluded: Boolean(chargesIncluded),
        depositMonths: Math.min(3, Math.max(0, Math.round(Number(depositMonths) || 1))),
        surface: Math.max(1, Math.round(Number(surface))),
        rooms: Math.max(1, Math.round(Number(rooms))),
        furnished: Boolean(furnished),
        availableFrom: availableFrom ? String(availableFrom) : "Immédiatement",
        conditions: conditions ? String(conditions) : "",
        photos: photoList.slice(0, 4),
        status: "en_attente",
      })
      .returning();

    return NextResponse.json({ ok: true, listingId: listing.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}