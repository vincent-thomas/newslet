CREATE TABLE `article` (
	`article_id` text PRIMARY KEY NOT NULL,
	`category` text,
	`paper_nonbiased_rating` integer NOT NULL,
	`published_at` integer NOT NULL,
	FOREIGN KEY (`category`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `article_history` (
	`history_id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `author` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`article_rating` integer NOT NULL,
	`published_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `article_category` (
	`relation_id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`article_id` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`article_id`) REFERENCES `article`(`article_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `category` (
	`category_id` text PRIMARY KEY NOT NULL,
	`category_value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rating` (
	`rating_id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`rating_type` text NOT NULL,
	`userId` text NOT NULL,
	`rating_value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`user_id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_customer_id_unique` ON `user` (`customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);