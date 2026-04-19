import { db } from '$lib/server/db'
import { recipeIngredients, recipes } from '$lib/server/db/schema'
import { count, desc, eq } from 'drizzle-orm'

export function load() {
	const rows = db
		.select({
			id: recipes.id,
			name: recipes.name,
			mealType: recipes.mealType,
			servings: recipes.servings,
			caloriesPerServing: recipes.caloriesPerServing,
			ingredientCount: count(recipeIngredients.id)
		})
		.from(recipes)
		.leftJoin(recipeIngredients, eq(recipeIngredients.recipeId, recipes.id))
		.groupBy(recipes.id)
		.orderBy(desc(recipes.updatedAt))
		.all()

	return { recipes: rows }
}
