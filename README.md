# LogementSûr — secure-housing-search-platform

Plateforme de recherche de logements qui **vérifie chaque annonce et chaque annonceur avant publication**, afin de limiter les annonces frauduleuses.

> Un logement, pas un piège.

## Fonctionnalités

| Domaine | Détail |
| --- | --- |
| Recherche | Filtres ville/quartier, type de bien, loyer max, surface min, annonces vérifiées uniquement |
| Annonces | Fiche détaillée avec galerie photo, localisation volontairement approximative, conditions, statut |
| Annonceurs | Vérification d'identité (pièce d'identité, justificatif de propriété, SIRET pour les agences) |
| Signalements | Motifs prédéfinis, suivi par la modération, historique public conservé intégralement |
| Suspicion | Suspension automatique d'une annonce à partir de 3 signalements |
| Visites | Demande de visite (date souhaitée, message) suivie par l'annonceur |
| Administration | Back-office de modération : validation d'annonceurs, statuts d'annonces, traitement des signalements |
| Sécurité | Rappel permanent : aucun paiement avant la visite |

## Stack technique

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9**
- **Tailwind CSS 4** (PostCSS)
- **PostgreSQL** via **Drizzle ORM** + `drizzle-kit`
- **lucide-react** pour les icônes

## Prérequis

- Node.js 20+
- PostgreSQL en local (ou une instance managée)

## Installation

```bash
npm install
cp .env.example .env.local   # puis renseignez DATABASE_URL
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Base de données

Le schéma Drizzle se trouve dans `src/db/schema.ts` (tables `advertisers`, `listings`, `visit_requests`, `reports`).

```bash
# appliquer les migrations
npx drizzle-kit push

# ou charger le jeu de données de démonstration
psql "$DATABASE_URL" -f scripts/seed.sql
```

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript (`tsc --noEmit`) |

## Structure

```
src/
├── app/
│   ├── admin/                 # back-office de modération
│   ├── annonces/[id]/         # fiche d'une annonce
│   ├── api/                   # routes REST (annonces, visites, signalements, admin, health)
│   ├── publier/               # dépôt d'annonce + dossier annonceur
│   ├── verification/          # procédure de vérification en 4 étapes
│   ├── layout.tsx
│   └── page.tsx               # page d'accueil
├── components/                # Header, Footer, ListingCard, PhotoGallery, ReportForm, ...
├── db/                        # schema.ts + pool Drizzle
└── lib/                       # queries, types, helpers de formatage
```

## Routes API

| Méthode | Route | Rôle |
| --- | --- | --- |
| `POST` | `/api/annonces` | Déposer une annonce + dossier annonceur |
| `POST` | `/api/visites` | Demander une visite |
| `POST` | `/api/signalements` | Signaler une annonce |
| `GET` | `/api/health` | État du service |
| `GET` | `/api/admin/data` | Données de modération |
| `PATCH` | `/api/admin/advertisers/[id]` | Statut de vérification d'un annonceur |
| `PATCH` | `/api/admin/listings/[id]` | Statut d'une annonce |
| `PATCH` | `/api/admin/reports/[id]` | Traitement d'un signalement |

## Licence

Projet à usage démonstratif / pédagogique.
