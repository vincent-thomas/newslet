import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "./src";
import { object, parse, string, url } from "valibot";

export const env = parse(
	object({
		DATABASE_URL: string([url()]),
		DATABASE_TOKEN: string(),
	}),
	process.env,
);

const db = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_TOKEN,
});
await migrate(db, { migrationsFolder: "migrations" });
