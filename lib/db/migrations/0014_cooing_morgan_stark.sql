ALTER TABLE `sessions` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;