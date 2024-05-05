import { defineConfig } from 'drizzle-kit';

export default defineConfig({
 schema: "./src/schema/index.ts",
  driver: 'libsql',
  out: "migrations",
  dbCredentials: {
    url: "libsql://newslet-vincent-thomas.turso.io",
  },
  verbose: true,
  strict: true,
})