import { db } from '$lib/server/db'
import { recipeIngredients, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { count, desc, eq } from 'drizzle-orm'

export function load() {
	const rows = db
		.select({
			id: recipes.id,
			name: recipes.name,
			servings: recipes.servings,
			caloriesPerServing: recipes.caloriesPerServing,
			proteinPerServing: recipes.proteinPerServing,
			ingredientCount: count(recipeIngredients.id)
		})
		.from(recipes)
		.leftJoin(recipeIngredients, eq(recipeIngredients.recipeId, recipes.id))
		.groupBy(recipes.id)
		.orderBy(desc(recipes.updatedAt))
		.all()

	const mealTypeRows = db.select().from(recipeMealTypes).all()
	const mealTypesByRecipeId = new Map<number, string[]>()

	for (const row of mealTypeRows) {
		mealTypesByRecipeId.set(row.recipeId, [...(mealTypesByRecipeId.get(row.recipeId) ?? []), row.mealType])
	}

	return {
		recipes: rows.map((recipe) => ({
			...recipe,
			mealTypes: mealTypesByRecipeId.get(recipe.id) ?? []
		}))
	}
}
