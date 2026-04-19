import { db } from '$lib/server/db'
import { recipeIngredients, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { parseRecipeForm } from '$lib/server/recipe-form'
import { redirect, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({ request }) => {
		const parsed = parseRecipeForm(await request.formData())

		if ('status' in parsed) {
			return parsed
		}

		const now = new Date().toISOString()

		const created = db.transaction(() => {
			const recipe = db
				.insert(recipes)
				.values({
					name: parsed.name,
					servings: parsed.servings,
					caloriesPerServing: parsed.caloriesPerServing,
					instructions: parsed.instructions,
					createdAt: now,
					updatedAt: now
				})
				.returning({ id: recipes.id })
				.get()

			db.insert(recipeMealTypes)
				.values(parsed.mealTypes.map((mealType) => ({ recipeId: recipe.id, mealType })))
				.run()

			db.insert(recipeIngredients)
				.values(
					parsed.ingredients.map((ingredient) => ({
						recipeId: recipe.id,
						name: ingredient.name,
						quantity: ingredient.quantity,
						unit: ingredient.unit,
						notes: ingredient.notes
					}))
				)
				.run()

			return recipe
		})

		redirect(303, `/recipes/${created.id}`)
	}
}
