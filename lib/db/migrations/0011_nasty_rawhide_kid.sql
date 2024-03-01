ALTER TABLE `sessions` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `sessions` DROP INDEX `user_token_idx`;--> statement-breakpoint
ALTER TABLE `sessions` ADD `expires_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `token`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `expiresAt`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `updatedAt`;