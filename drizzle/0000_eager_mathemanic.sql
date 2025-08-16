CREATE TABLE `total-recall-hack_context` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`url` text,
	`text` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `context_name_idx` ON `total-recall-hack_context` (`name`);--> statement-breakpoint
CREATE TABLE `total-recall-hack_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `total-recall-hack_post` (`name`);