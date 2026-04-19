import { db } from '$lib/server/db'
import { recipeIngredients, recipes } from '$lib/server/db/schema'
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

	return { recipe, ingredients }
}

export const actions: Actions = {
	delete: ({ params }) => {
		const id = Number(params.id)

		db.delete(recipes).where(eq(recipes.id, id)).run()

		redirect(303, '/recipes')
	}
}
