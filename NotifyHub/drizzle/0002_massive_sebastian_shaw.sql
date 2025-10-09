CREATE TABLE `queue_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`notification_id` integer NOT NULL,
	`job_id` text NOT NULL,
	`queue` text NOT NULL,
	`priority` integer NOT NULL,
	`status` text NOT NULL,
	`attempts` integer DEFAULT 0,
	`processed_at` text,
	`failed_at` text,
	`completed_at` text,
	`error` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `queue_jobs_job_id_unique` ON `queue_jobs` (`job_id`);--> statement-breakpoint
ALTER TABLE `notifications` ADD `retry_count` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `notifications` ADD `last_retry_at` text;--> statement-breakpoint
ALTER TABLE `notifications` ADD `next_retry_at` text;--> statement-breakpoint
ALTER TABLE `notifications` ADD `failover_channel` text;--> statement-breakpoint
ALTER TABLE `notifications` ADD `failover_status` text DEFAULT 'not_attempted';