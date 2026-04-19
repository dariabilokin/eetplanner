import { db } from '$lib/server/db'
import { ingredients as ingredientTable, recipeIngredients, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { error, redirect, type Actions } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export function load({ params }) {
	const id = Number(params.id)

	const recipe = db.select().from(recipes).where(eq(recipes.id, id)).get()

	if (!recipe) {
		error(404, 'Recipe not found')
	}

	const ingredients = db
		.select({
			id: recipeIngredients.id,
			recipeId: recipeIngredients.recipeId,
			ingredientId: recipeIngredients.ingredientId,
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

	return { recipe, ingredients, mealTypes }
}

export const actions: Actions = {
	delete: ({ params }) => {
		const id = Number(params.id)

		db.delete(recipes).where(eq(recipes.id, id)).run()

		redirect(303, '/recipes')
	}
}
