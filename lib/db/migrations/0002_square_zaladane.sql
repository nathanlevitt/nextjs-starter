CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(256) NOT NULL,
	`expiresAt` datetime NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_token_idx` UNIQUE(`userId`,`token`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;