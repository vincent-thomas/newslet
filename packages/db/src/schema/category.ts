import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { articleTable } from "./article";

export const categoryTable = sqliteTable("category", {
	categoryId: text("category_id").primaryKey(),
	value: text("category_value").notNull(),
});

export const articleCategoryTable = sqliteTable("article_category", {
	id: text("relation_id").primaryKey(),
	categoryId: text("category_id").references(() => categoryTable.categoryId),
	articleId: text("article_id")
		.notNull()
		.references(() => articleTable.articleId),
});
