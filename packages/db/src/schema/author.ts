import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categoryTable } from "./category";

export const authorTable = sqliteTable("author", {
	authorId: text("id").primaryKey(),
	categoryId: text("category_id")
		.notNull()
		.references(() => categoryTable.categoryId),
	articleRating: integer("article_rating").notNull(),
	publishedAt: integer("published_at").notNull(),
});
