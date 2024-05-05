import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categoryTable } from "./category";

export const articleTable = sqliteTable("article", {
	articleId: text("article_id").primaryKey(),
	categoryId: text("category")
		.references(() => categoryTable.categoryId),
	paperRating: integer("paper_nonbiased_rating").notNull(),
	publishedAt: integer("published_at").notNull(),

	originalLink: text("link").notNull(),
	provider: text("provider").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),

});
