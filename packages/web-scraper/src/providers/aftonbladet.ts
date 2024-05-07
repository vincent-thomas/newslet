import Parser from "rss-parser";
import {
	array,
	type Input,
	date,
	object,
	parse,
	string,
	url,
	parseAsync,
	optional,
	variant,
	literal,
	any,
} from "valibot";
import { type articleInterface, contentInterface } from "../interfaces";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { formattedArticleBucket } from "@newslet/infra-consts";

const aftonbladetRssValidator = array(
	object({
		title: string(),
		link: string([url()]),
		pubDate: string(),
		enclosure: optional(
			object({
				url: string([url()]),
				length: string(),
				type: string(),
			}),
		),
		content: string(),
		contentSnippet: string(),
		guid: string(),
		isoDate: string(),
	}),
);

const SUPPORTED_CONTENT_TYPE = ["text", "image"];

async function parseAftonbladetArticle(
	articleId: string,
): Promise<Input<typeof articleInterface>> {
	const response = await fetch(
		`https://www.aftonbladet.se/hyper-api/v1/pages/articles/${articleId}`,
	).then((v) => v.json());

	let hasStarted = false;
	let hasPassed = false;

	const abContentContent = Object.entries(response.items)
		.filter(([key, value]) => {
			if (typeof value === "string" || typeof key !== "string") {
				throw new Error("");
			}

			if (hasPassed) {
				return false;
			}

			if (key === "article-marker-end") {
				hasPassed = true;
				return false;
			}
			if ((key.includes("image") && key !== "image") || key.includes("ad")) {
				return false;
			}

			if (hasStarted) {
				// @ts-expect-error just because
				return SUPPORTED_CONTENT_TYPE.includes(value.type);
			}

			if (key === "article-marker-content-start") {
				hasStarted = true;
				return false;
			}

			return false;
		})
		.map((v) => v[1])
		.map((RAW_thing) => {
			const thing = parse(
				variant("type", [
					object({
						type: literal("image"),
						altText: string(),
						imageAsset: object({
							urls: any(),
						}),
					}),
					object({
						type: literal("text"),
						text: object({ value: string() }),
						subtype: optional(string()),
					}),
				]),
				RAW_thing,
			);
			if (typeof thing === "string") {
				throw new Error("");
			}
			if (thing.type === "image") {
				return parse(contentInterface, {
					type: "image",
					caption: thing.altText,
					urls: thing.imageAsset.urls,
				});
			}
			if (thing.type === "text") {
				return parse(contentInterface, {
					type: "paragraph",
					content: thing.text.value,
					subtype: thing?.subtype,
				});
			}
		});

	const description = parse(
		string(),
		response.clientProperties.promotionContent.description.value,
	);
	const title = parse(string(), response.clientProperties.pageTitle);
	const publishedDate = parse(
		date(),
		new Date(response.clientProperties.changes.published),
	);

	return {
		title,
		provider: "aftonbladet",
		articleId,
		content: abContentContent,
		description,
		articleLink: parse(string([url()]), response.links.shareUrl),
		publishedDate,
	};
}

export async function fromAftonbladet(): Promise<
	Input<typeof articleInterface>[]
> {
	const parser = new Parser();
	const rawContent = await parser.parseURL(
		"https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt",
	);
	const content = parse(aftonbladetRssValidator, rawContent.items);

	const parsedArticles = await Promise.all(
		content
			.filter((v) => v.guid.startsWith("article:"))
			.map(async (article) => {
				return await parseAftonbladetArticle(
					article.guid.replace("article:", ""),
				);
			}),
	);

	return parsedArticles;
}
