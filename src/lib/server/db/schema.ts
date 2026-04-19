import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  mealType: text('meal_type').notNull(),
  servings: integer('servings').notNull().default(1),
  caloriesPerServing: real('calories_per_serving'),
  instructions: text('instructions'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  quantity: real('quantity'),
  unit: text('unit'),
  notes: text('notes'),
})

export const mealPlans = sqliteTable('meal_plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const plannedMeals = sqliteTable('planned_meals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mealPlanId: integer('meal_plan_id')
    .notNull()
    .references(() => mealPlans.id, { onDelete: 'cascade' }),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  mealType: text('meal_type').notNull(),
  servings: integer('servings').notNull().default(1),
  locked: integer('locked', { mode: 'boolean' }).notNull().default(false),
})
