import { readFileSync } from "node:fs";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

const sql = readFileSync("scripts/seed.sql", "utf8");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
await client.query(sql);

const { rows } = await client.query(`
  select
    (select count(*) from advertisers)    as advertisers,
    (select count(*) from listings)       as listings,
    (select count(*) from visit_requests) as visits,
    (select count(*) from reports)        as reports
`);

console.log("Seed OK:", rows[0]);
await client.end();
