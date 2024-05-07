import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ratingTable = sqliteTable("rating", {
	ratingId: text("rating_id").primaryKey(),
	entityId: text("entity_id").notNull(),
	type: text("rating_type").notNull(),
	userId: text("userId").notNull(),
	rating: integer("rating_value").notNull(),
});
