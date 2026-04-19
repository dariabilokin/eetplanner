CREATE TABLE `recipe_meal_types` (
	`recipe_id` integer NOT NULL,
	`meal_type` text NOT NULL,
	PRIMARY KEY(`recipe_id`, `meal_type`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `recipe_meal_types` (`recipe_id`, `meal_type`)
SELECT `id`, `meal_type` FROM `recipes`;
--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `meal_type`;
