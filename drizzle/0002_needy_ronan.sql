CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`default_unit` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_normalized_name_unique` ON `ingredients` (`normalized_name`);--> statement-breakpoint
INSERT INTO `ingredients` (`name`, `normalized_name`, `default_unit`, `created_at`, `updated_at`)
SELECT
	min(`name`) AS `name`,
	lower(trim(`name`)) AS `normalized_name`,
	min(`unit`) AS `default_unit`,
	datetime('now') AS `created_at`,
	datetime('now') AS `updated_at`
FROM `recipe_ingredients`
GROUP BY lower(trim(`name`));
--> statement-breakpoint
CREATE TABLE `__new_recipe_ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	`quantity` real,
	`unit` text,
	`notes` text,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_recipe_ingredients` (`id`, `recipe_id`, `ingredient_id`, `quantity`, `unit`, `notes`)
SELECT
	ri.`id`,
	ri.`recipe_id`,
	i.`id`,
	ri.`quantity`,
	ri.`unit`,
	ri.`notes`
FROM `recipe_ingredients` ri
INNER JOIN `ingredients` i ON i.`normalized_name` = lower(trim(ri.`name`));
--> statement-breakpoint
DROP TABLE `recipe_ingredients`;
--> statement-breakpoint
ALTER TABLE `__new_recipe_ingredients` RENAME TO `recipe_ingredients`;
--> statement-breakpoint
ALTER TABLE `recipes` ADD `source_id` text;--> statement-breakpoint
ALTER TABLE `recipes` ADD `protein_per_serving` real;--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_source_id_unique` ON `recipes` (`source_id`);
