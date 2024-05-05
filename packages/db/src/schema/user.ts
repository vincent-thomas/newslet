import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
	userId: text("user_id").primaryKey(),
	customerId: text("customer_id").notNull().unique(),
	email: text("email").unique().notNull(),
	name: text("name").notNull(),
	createdAt: integer("created_at").notNull(),
});
