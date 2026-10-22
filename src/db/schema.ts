import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

/** Annonceurs (propriétaires ou agences) soumis à une procédure de vérification */
export const advertisers = pgTable("advertisers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("particulier"), // particulier | agence
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  // Documents fournis pour la vérification
  idDocumentProvided: boolean("id_document_provided").notNull().default(false),
  ownershipProofProvided: boolean("ownership_proof_provided").notNull().default(false),
  siret: text("siret"),
  verificationStatus: text("verification_status").notNull().default("en_attente"), // en_attente | verifie | rejete
  verificationNote: text("verification_note"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Annonces de logements contrôlées par la modération */
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  advertiserId: integer("advertiser_id")
    .notNull()
    .references(() => advertisers.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyType: text("property_type").notNull(), // appartement | maison | studio | chambre
  city: text("city").notNull(),
  district: text("district").notNull(),
  approxZone: text("approx_zone").notNull(), // description de la zone approximative
  price: integer("price").notNull(), // loyer mensuel en euros
  chargesIncluded: boolean("charges_included").notNull().default(false),
  depositMonths: integer("deposit_months").notNull().default(1),
  surface: integer("surface").notNull(),
  rooms: integer("rooms").notNull(),
  furnished: boolean("furnished").notNull().default(false),
  availableFrom: text("available_from").notNull(),
  conditions: text("conditions").notNull().default(""),
  photos: text("photos").array().notNull().default([]),
  status: text("status").notNull().default("en_attente"), // en_attente | verifiee | suspendue
  reportCount: integer("report_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Demandes de visite envoyées aux annonceurs */
export const visitRequests = pgTable("visit_requests", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredDate: text("preferred_date").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("envoyee"), // envoyee | confirmee | annulee
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Signalements d'annonces suspectes — historique conservé intégralement */
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id),
  reason: text("reason").notNull(),
  details: text("details").notNull().default(""),
  reporterEmail: text("reporter_email"),
  status: text("status").notNull().default("ouvert"), // ouvert | en_cours | confirme | classe_sans_suite
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export type Advertiser = typeof advertisers.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type VisitRequest = typeof visitRequests.$inferSelect;
export type Report = typeof reports.$inferSelect;