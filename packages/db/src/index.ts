import { createClient as cClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const createClient = ({
	url,
	authToken,
}: { url: string; authToken: string }) => {
	const client = cClient({ url, authToken });
	return drizzle(client);
};

export * from "./schema";
