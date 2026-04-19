import { db } from '$lib/server/db'
import { ingredients as ingredientTable, recipeIngredients, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { getOrCreateIngredient } from '$lib/server/ingredients'
import { ingredientLinesFromRows, parseRecipeForm } from '$lib/server/recipe-form'
import { error, redirect, type Actions } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export function load({ params }) {
	const id = Number(params.id)

	const recipe = db.select().from(recipes).where(eq(recipes.id, id)).get()

	if (!recipe) {
		error(404, 'Recipe not found')
	}

	const recipeIngredientRows = db
		.select({
			name: ingredientTable.name,
			quantity: recipeIngredients.quantity,
			unit: recipeIngredients.unit,
			notes: recipeIngredients.notes
		})
		.from(recipeIngredients)
		.innerJoin(ingredientTable, eq(ingredientTable.id, recipeIngredients.ingredientId))
		.where(eq(recipeIngredients.recipeId, id))
		.orderBy(recipeIngredients.id)
		.all()

	const mealTypes = db
		.select()
		.from(recipeMealTypes)
		.where(eq(recipeMealTypes.recipeId, id))
		.orderBy(recipeMealTypes.mealType)
		.all()
		.map((row) => row.mealType)

	return {
		recipe,
		mealTypes,
		ingredientLines: ingredientLinesFromRows(recipeIngredientRows)
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
					servings: parsed.servings,
					caloriesPerServing: parsed.caloriesPerServing,
					proteinPerServing: parsed.proteinPerServing,
					instructions: parsed.instructions,
					updatedAt: now
				})
				.where(eq(recipes.id, id))
				.run()

			db.delete(recipeMealTypes).where(eq(recipeMealTypes.recipeId, id)).run()
			db.insert(recipeMealTypes)
				.values(parsed.mealTypes.map((mealType) => ({ recipeId: id, mealType })))
				.run()

			db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id)).run()
			db.insert(recipeIngredients)
				.values(
					parsed.ingredients.map((recipeIngredient) => {
						const ingredient = getOrCreateIngredient(recipeIngredient.name, recipeIngredient.unit)

						return {
							recipeId: id,
							ingredientId: ingredient.id,
							quantity: recipeIngredient.quantity,
							unit: recipeIngredient.unit,
							notes: recipeIngredient.notes
						}
					})
				)
				.run()
		})

		redirect(303, `/recipes/${id}`)
	}
}
