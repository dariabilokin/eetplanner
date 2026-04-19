import { db } from '$lib/server/db'
import { mealPlans, plannedMeals, recipes } from '$lib/server/db/schema'
import { addDays, mondayForDate } from '$lib/server/meal-plan-generator'
import { error, redirect, type Actions } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack']
const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

	const mealsByDateAndType = new Map<string, Map<string, (typeof rows)[number]>>()

	for (const meal of rows) {
		const mealsByType = mealsByDateAndType.get(meal.date) ?? new Map<string, (typeof rows)[number]>()
		mealsByType.set(meal.mealType, meal)
		mealsByDateAndType.set(meal.date, mealsByType)
	}

	const firstMonday = mondayForDate(plan.startDate)
	const lastMonday = mondayForDate(plan.endDate)
	const weeks = []

	for (let weekStart = firstMonday; weekStart <= lastMonday; weekStart = addDays(weekStart, 7)) {
		const days = weekDayLabels.map((label, index) => {
			const date = addDays(weekStart, index)
			const meals = mealsByDateAndType.get(date)
			const dayMeals = mealTypeOrder.map((mealType) => meals?.get(mealType) ?? null)
			const presentMeals = dayMeals.filter((meal) => meal !== null)
			const calories = totalFor(presentMeals, 'caloriesPerServing')
			const protein = totalFor(presentMeals, 'proteinPerServing')

			return { label, date, meals: dayMeals, calories, protein }
		})

		weeks.push({ weekStart, days })
	}

	return { plan, weeks, mealTypes: mealTypeOrder }
}

export const actions: Actions = {
	delete: ({ params }) => {
		const id = Number(params.id)

		db.delete(mealPlans).where(eq(mealPlans.id, id)).run()

		redirect(303, '/meal-plans')
	}
}

function totalFor(
	meals: Array<{
		servings: number
		caloriesPerServing: number | null
		proteinPerServing: number | null
	}>,
	key: 'caloriesPerServing' | 'proteinPerServing',
) {
	if (meals.length === 0) {
		return null
	}

	return meals.reduce<number | null>((total, meal) => {
		if (!meal || total === null || meal[key] === null) {
			return null
		}

		return total + meal[key] * meal.servings
	}, 0)
}
