import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const articleHistory = sqliteTable("article_history", {
	historyId: text("history_id").primaryKey(),
	articleId: text("article_id").notNull(),
	userId: text("user_id").references(() => userTable.userId),
});
