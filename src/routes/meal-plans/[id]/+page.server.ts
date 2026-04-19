import { db } from '$lib/server/db'
import { mealPlans, plannedMeals, recipes } from '$lib/server/db/schema'
import { error, redirect, type Actions } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack']

export function load({ params }) {
	const id = Number(params.id)
	const plan = db.select().from(mealPlans).where(eq(mealPlans.id, id)).get()

	if (!plan) {
		error(404, 'Meal plan not found')
	}

	const rows = db
		.select({
			id: plannedMeals.id,
			date: plannedMeals.date,
			mealType: plannedMeals.mealType,
			servings: plannedMeals.servings,
			recipeId: recipes.id,
			recipeName: recipes.name,
			caloriesPerServing: recipes.caloriesPerServing,
			proteinPerServing: recipes.proteinPerServing
		})
		.from(plannedMeals)
		.innerJoin(recipes, eq(recipes.id, plannedMeals.recipeId))
		.where(eq(plannedMeals.mealPlanId, id))
		.orderBy(asc(plannedMeals.date))
		.all()
		.sort((a, b) => {
			if (a.date !== b.date) {
				return a.date.localeCompare(b.date)
			}

			return mealTypeOrder.indexOf(a.mealType) - mealTypeOrder.indexOf(b.mealType)
		})

	const days = rows.reduce<
		Array<{
			date: string
			meals: typeof rows
			calories: number | null
			protein: number | null
		}>
	>((result, meal) => {
		let day = result.find((item) => item.date === meal.date)

		if (!day) {
			day = { date: meal.date, meals: [], calories: 0, protein: 0 }
			result.push(day)
		}

		day.meals.push(meal)
		day.calories =
			day.calories === null || meal.caloriesPerServing === null
				? null
				: day.calories + meal.caloriesPerServing * meal.servings
		day.protein =
			day.protein === null || meal.proteinPerServing === null
				? null
				: day.protein + meal.proteinPerServing * meal.servings

		return result
	}, [])

	return { plan, days }
}

export const actions: Actions = {
	delete: ({ params }) => {
		const id = Number(params.id)

		db.delete(mealPlans).where(eq(mealPlans.id, id)).run()

		redirect(303, '/meal-plans')
	}
}
