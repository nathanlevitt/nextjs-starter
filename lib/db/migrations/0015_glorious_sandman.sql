CREATE TABLE `email_verification_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`code` varchar(8) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `email_verification_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_verification_codes_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` varchar(40) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `expires_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `email_idx`;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `user_idx` ON `email_verification_codes` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `email_verification_codes` (`email`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `password_reset_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);