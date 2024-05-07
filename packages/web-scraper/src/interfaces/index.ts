import {
	array,
	date,
	literal,
	number,
	object,
	optional,
	picklist,
	string,
	url,
	variant,
} from "valibot";

export const contentInterface = variant("type", [
	object({
		type: literal("paragraph"),
		content: string(),
		subtype: optional(picklist(["lead"])),
	}),
	object({
		type: literal("image"),
		caption: optional(string()),
		urls: array(
			object({ url: string([url()]), width: number(), height: number() }),
		),
	}),
]);

export const articleInterface = object({
	articleId: string(),
	provider: picklist(["aftonbladet", "gp"]),
	title: string(),
	description: string(),
	publishedDate: date(),
	articleLink: string([url()]),
	content: array(contentInterface),
});
