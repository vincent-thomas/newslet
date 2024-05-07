import { articleTable } from "@newslet/db";
import { db } from "./db-client";
import { fromAftonbladet } from "./providers/aftonbladet";
import { fromGp } from "./providers/gp";
import { eq } from "drizzle-orm";
import { formattedArticleBucket } from "@newslet/infra-consts";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client();

export default {
	async fetch(): Promise<Response> {
		const ab = await fromAftonbladet();
		const gp = await fromGp();

		for (const item of [...ab, ...gp]) {
			const response = await db
				.select()
				.from(articleTable)
				.where(eq(articleTable.articleId, item.articleId));

			if (response.length !== 0) {
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
			});

			const command = new PutObjectCommand({
				Body: JSON.stringify(item.content),
				Key: item.articleId,
				Bucket: formattedArticleBucket,
			});

			await s3.send(command);
		}

		return Response.json([...ab, ...gp], {
			status: 200,
		});
	},
};
