import { db } from '$lib/server/db'
import { ingredients, recipeIngredients } from '$lib/server/db/schema'
import { count, like, asc, eq } from 'drizzle-orm'

export function load({ url }) {
	const search = url.searchParams.get('search')?.trim() ?? ''
	const query = db
		.select({
			id: ingredients.id,
			name: ingredients.name,
			defaultUnit: ingredients.defaultUnit,
			recipeCount: count(recipeIngredients.id)
		})
		.from(ingredients)
		.leftJoin(recipeIngredients, eq(recipeIngredients.ingredientId, ingredients.id))
		.groupBy(ingredients.id)
		.orderBy(asc(ingredients.name))

	const rows = search ? query.where(like(ingredients.normalizedName, `%${search.toLowerCase()}%`)).all() : query.all()

	return { ingredients: rows, search }
}
