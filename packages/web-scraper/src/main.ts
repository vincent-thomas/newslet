import { articleTable } from "@newslet/db";
import { db } from "./db-client";
import { fromAftonbladet } from "./providers/aftonbladet";
import { fromGp } from "./providers/gp";
import { eq } from "drizzle-orm";

export default {
	async fetch(): Promise<Response> {
		const ab = await fromAftonbladet();
		const gp = await fromGp();

		for (const item of [...ab, ...gp]) {
			const response = await db.select().from(articleTable).where(eq(articleTable.articleId, item.articleId))

			if (response.length !== 0) {
				console.log(response);
				continue;
			}

			await db.insert(articleTable).values({
				articleId: item.articleId,
				paperRating: 0,
				publishedAt: item.publishedDate.getTime(),
				title: item.title,
				originalLink: item.articleLink,
				provider: item.provider,
				description: item.description,
			})
		}

		return Response.json([...ab, ...gp], {
			status: 200,
		});
	},
};
