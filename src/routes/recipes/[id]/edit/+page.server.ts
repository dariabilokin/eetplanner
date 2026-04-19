import { db } from '$lib/server/db'
import { recipeIngredients, recipes } from '$lib/server/db/schema'
import { ingredientLinesFromRows, parseRecipeForm } from '$lib/server/recipe-form'
import { error, redirect, type Actions } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export function load({ params }) {
	const id = Number(params.id)

	const recipe = db.select().from(recipes).where(eq(recipes.id, id)).get()

	if (!recipe) {
		error(404, 'Recipe not found')
	}

	const ingredients = db
		.select()
		.from(recipeIngredients)
		.where(eq(recipeIngredients.recipeId, id))
		.orderBy(recipeIngredients.id)
		.all()

	return {
		recipe,
		ingredientLines: ingredientLinesFromRows(ingredients)
	}
}

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id)
		const parsed = parseRecipeForm(await request.formData())

		if ('status' in parsed) {
			return parsed
		}

		const now = new Date().toISOString()

		db.transaction(() => {
			db.update(recipes)
				.set({
					name: parsed.name,
					mealType: parsed.mealType,
					servings: parsed.servings,
					caloriesPerServing: parsed.caloriesPerServing,
					instructions: parsed.instructions,
					updatedAt: now
				})
				.where(eq(recipes.id, id))
				.run()

			db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id)).run()
			db.insert(recipeIngredients)
				.values(
					parsed.ingredients.map((ingredient) => ({
						recipeId: id,
						name: ingredient.name,
						quantity: ingredient.quantity,
						unit: ingredient.unit,
						notes: ingredient.notes
					}))
				)
				.run()
		})

		redirect(303, `/recipes/${id}`)
	}
}
