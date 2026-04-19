import { db } from '$lib/server/db'
import { mealPlans, plannedMeals, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { addDays, parseMealPlanForm } from '$lib/server/meal-plan-generator'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { asc, desc, eq } from 'drizzle-orm'

export function load() {
	const plans = db
		.select({
			id: mealPlans.id,
			name: mealPlans.name,
			startDate: mealPlans.startDate,
			endDate: mealPlans.endDate,
			createdAt: mealPlans.createdAt
		})
		.from(mealPlans)
		.orderBy(desc(mealPlans.createdAt))
		.all()

	return { plans }
}

export const actions: Actions = {
	generate: async ({ request }) => {
		const parsed = parseMealPlanForm(await request.formData())

		if ('status' in parsed) {
			return parsed
		}

		const recipesByMealType = new Map<string, Array<{ id: number }>>()

		for (const mealType of parsed.mealTypes) {
			const matchingRecipes = db
				.select({ id: recipes.id })
				.from(recipes)
				.innerJoin(recipeMealTypes, eq(recipeMealTypes.recipeId, recipes.id))
				.where(eq(recipeMealTypes.mealType, mealType))
				.orderBy(asc(recipes.id))
				.all()

			if (matchingRecipes.length === 0) {
				return fail(400, {
					message: `No recipes available for ${mealType}. Add or tag recipes first.`,
					values: {
						name: parsed.name ?? '',
						startDate: parsed.startDate,
						days: String(parsed.days),
						servings: String(parsed.servings),
						mealTypes: parsed.mealTypes
					}
				})
			}

			recipesByMealType.set(mealType, matchingRecipes)
		}

		const now = new Date().toISOString()
		const endDate = addDays(parsed.startDate, parsed.days - 1)

		const mealPlan = db.transaction(() => {
			const created = db
				.insert(mealPlans)
				.values({
					name: parsed.name ?? `Meal plan ${parsed.startDate}`,
					startDate: parsed.startDate,
					endDate,
					createdAt: now,
					updatedAt: now
				})
				.returning({ id: mealPlans.id })
				.get()

			const plannedMealRows = []

			for (let dayIndex = 0; dayIndex < parsed.days; dayIndex += 1) {
				const date = addDays(parsed.startDate, dayIndex)

				for (let mealTypeIndex = 0; mealTypeIndex < parsed.mealTypes.length; mealTypeIndex += 1) {
					const mealType = parsed.mealTypes[mealTypeIndex]
					const candidates = recipesByMealType.get(mealType) ?? []
					const recipe = candidates[(dayIndex + mealTypeIndex) % candidates.length]

					plannedMealRows.push({
						mealPlanId: created.id,
						recipeId: recipe.id,
						date,
						mealType,
						servings: parsed.servings,
						locked: false
					})
				}
			}

			db.insert(plannedMeals).values(plannedMealRows).run()

			return created
		})

		redirect(303, `/meal-plans/${mealPlan.id}`)
	}
}
