import { buildConfig } from "payload/config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { AdminUsers } from "./collections/AdminUsers";
import { Buildings } from "./collections/Buildings";
import { Floors } from "./collections/Floors";
import { Leads } from "./collections/Leads";
import { LegalPages } from "./collections/LegalPages";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { SiteSettings } from "./collections/SiteSettings";
import { Typologies } from "./collections/Typologies";
import { Units } from "./collections/Units";

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: AdminUsers.slug,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [
    AdminUsers,
    Buildings,
    Floors,
    Typologies,
    Units,
    Leads,
    Media,
    Pages,
    Posts,
    LegalPages,
    SiteSettings,
  ],
  typescript: {
    outputFile: "payload-types.ts",
  },
});
