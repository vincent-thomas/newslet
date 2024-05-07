import { object, parse, string, url } from "valibot";

export const env = parse(
	object({
		DATABASE_URL: string([url()]),
		DATABASE_TOKEN: string(),
	}),
	process.env,
);
