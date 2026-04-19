import { db } from '$lib/server/db'
import { recipeIngredients, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { getOrCreateIngredient } from '$lib/server/ingredients'
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
					proteinPerServing: parsed.proteinPerServing,
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
					parsed.ingredients.map((recipeIngredient) => {
						const ingredient = getOrCreateIngredient(recipeIngredient.name, recipeIngredient.unit)

						return {
							recipeId: recipe.id,
							ingredientId: ingredient.id,
							quantity: recipeIngredient.quantity,
							unit: recipeIngredient.unit,
							notes: recipeIngredient.notes
						}
					})
				)
				.run()

			return recipe
		})

		redirect(303, `/recipes/${created.id}`)
	}
}
