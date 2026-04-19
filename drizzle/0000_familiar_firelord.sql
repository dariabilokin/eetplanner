CREATE TABLE `meal_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `planned_meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meal_plan_id` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`date` text NOT NULL,
	`meal_type` text NOT NULL,
	`servings` integer DEFAULT 1 NOT NULL,
	`locked` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`meal_plan_id`) REFERENCES `meal_plans`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`name` text NOT NULL,
	`quantity` real,
	`unit` text,
	`notes` text,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`meal_type` text NOT NULL,
	`servings` integer DEFAULT 1 NOT NULL,
	`calories_per_serving` real,
	`instructions` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
