import { db } from '$lib/server/db'
import { mealPlans, plannedMeals, recipeMealTypes, recipes } from '$lib/server/db/schema'
import { addDays, mondayForDate } from '$lib/server/meal-plan-generator'
import { error, fail, redirect, type Actions } from '@sveltejs/kit'
import { and, asc, eq } from 'drizzle-orm'

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
	const candidateRecipesByMealType: Record<string, Array<{ id: number; name: string }>> = {}

	for (const mealType of mealTypeOrder) {
		candidateRecipesByMealType[mealType] = db
			.select({
				id: recipes.id,
				name: recipes.name
			})
			.from(recipes)
			.innerJoin(recipeMealTypes, eq(recipeMealTypes.recipeId, recipes.id))
			.where(eq(recipeMealTypes.mealType, mealType))
			.orderBy(asc(recipes.name))
			.all()
	}

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

	return { plan, weeks, mealTypes: mealTypeOrder, candidateRecipesByMealType }
}

export const actions: Actions = {
	replaceMeal: async ({ request, params }) => {
		const mealPlanId = Number(params.id)
		const formData = await request.formData()
		const plannedMealId = Number(formData.get('plannedMealId'))
		const recipeId = Number(formData.get('recipeId'))

		if (!Number.isInteger(plannedMealId) || !Number.isInteger(recipeId)) {
			return fail(400, { message: 'Choose a valid recipe.' })
		}

		const plannedMeal = db
			.select()
			.from(plannedMeals)
			.where(eq(plannedMeals.id, plannedMealId))
			.get()

		if (!plannedMeal || plannedMeal.mealPlanId !== mealPlanId) {
			return fail(404, { message: 'Planned meal not found.' })
		}

		const matchingRecipe = findRecipeForMealType(recipeId, plannedMeal.mealType)

		if (!matchingRecipe) {
			return fail(400, { message: `Recipe is not tagged for ${plannedMeal.mealType}.` })
		}

		db.update(plannedMeals)
			.set({ recipeId })
			.where(eq(plannedMeals.id, plannedMealId))
			.run()
	},
	randomMeal: async ({ request, params }) => {
		const mealPlanId = Number(params.id)
		const formData = await request.formData()
		const plannedMealId = Number(formData.get('plannedMealId'))

		if (!Number.isInteger(plannedMealId)) {
			return fail(400, { message: 'Choose a valid planned meal.' })
		}

		const plannedMeal = db
			.select()
			.from(plannedMeals)
			.where(eq(plannedMeals.id, plannedMealId))
			.get()

		if (!plannedMeal || plannedMeal.mealPlanId !== mealPlanId) {
			return fail(404, { message: 'Planned meal not found.' })
		}

		const candidates = db
			.select({ id: recipes.id })
			.from(recipes)
			.innerJoin(recipeMealTypes, eq(recipeMealTypes.recipeId, recipes.id))
			.where(eq(recipeMealTypes.mealType, plannedMeal.mealType))
			.orderBy(asc(recipes.id))
			.all()

		const replacementPool =
			candidates.length > 1 ? candidates.filter((recipe) => recipe.id !== plannedMeal.recipeId) : candidates
		const replacement = replacementPool[Math.floor(Math.random() * replacementPool.length)]

		if (!replacement) {
			return fail(400, { message: `No recipes available for ${plannedMeal.mealType}.` })
		}

		db.update(plannedMeals)
			.set({ recipeId: replacement.id })
			.where(eq(plannedMeals.id, plannedMealId))
			.run()
	},
	delete: ({ params }) => {
		const id = Number(params.id)

		db.delete(mealPlans).where(eq(mealPlans.id, id)).run()

		redirect(303, '/meal-plans')
	}
}

function findRecipeForMealType(recipeId: number, mealType: string) {
	return db
		.select({ id: recipes.id })
		.from(recipes)
		.innerJoin(recipeMealTypes, eq(recipeMealTypes.recipeId, recipes.id))
		.where(and(eq(recipes.id, recipeId), eq(recipeMealTypes.mealType, mealType)))
		.get()
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
