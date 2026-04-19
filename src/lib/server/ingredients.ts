import { db } from '$lib/server/db'
import { ingredients } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export function normalizeIngredientName(name: string) {
	return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getOrCreateIngredient(name: string, defaultUnit: string | null = null) {
	const normalizedName = normalizeIngredientName(name)
	const existing = db.select().from(ingredients).where(eq(ingredients.normalizedName, normalizedName)).get()

	if (existing) {
		return existing
	}

	const now = new Date().toISOString()

	return db
		.insert(ingredients)
		.values({
			name: name.trim(),
			normalizedName,
			defaultUnit,
			createdAt: now,
			updatedAt: now
		})
		.returning()
		.get()
}
