import { fail, type ActionFailure } from '@sveltejs/kit'

export type MealPlanFormInput = {
	name: string | null
	startDate: string
	days: number
	servings: number
	mealTypes: string[]
}

export type MealPlanFormError = {
	message: string
	values: {
		name: string
		startDate: string
		days: string
		servings: string
		mealTypes: string[]
	}
}

const mealTypes = new Set(['breakfast', 'lunch', 'dinner', 'snack'])

export function parseMealPlanForm(formData: FormData): MealPlanFormInput | ActionFailure<MealPlanFormError> {
	const values = {
		name: stringValue(formData, 'name'),
		startDate: stringValue(formData, 'startDate'),
		days: stringValue(formData, 'days'),
		servings: stringValue(formData, 'servings'),
		mealTypes: formData.getAll('mealTypes').map(String)
	}

	const days = Number(values.days)
	const servings = Number(values.servings)

	if (!values.startDate || Number.isNaN(new Date(`${values.startDate}T00:00:00`).getTime())) {
		return formError('Choose a valid start date.', values)
	}

	if (!Number.isInteger(days) || days < 1 || days > 21) {
		return formError('Days must be between 1 and 21.', values)
	}

	if (!Number.isInteger(servings) || servings < 1) {
		return formError('Servings must be a whole number greater than 0.', values)
	}

	if (values.mealTypes.length === 0 || values.mealTypes.some((mealType) => !mealTypes.has(mealType))) {
		return formError('Choose at least one meal type.', values)
	}

	return {
		name: values.name || null,
		startDate: values.startDate,
		days,
		servings,
		mealTypes: [...new Set(values.mealTypes)]
	}
}

export function addDays(date: string, days: number) {
	const value = new Date(`${date}T00:00:00`)
	value.setDate(value.getDate() + days)
	return formatDate(value)
}

export function mondayForDate(date: string) {
	const value = new Date(`${date}T00:00:00`)
	const day = value.getDay()
	const offset = day === 0 ? -6 : 1 - day
	value.setDate(value.getDate() + offset)

	return formatDate(value)
}

export function nextMonday(date = new Date()) {
	const value = new Date(date)
	const day = value.getDay()
	const offset = day === 1 ? 0 : day === 0 ? 1 : 8 - day
	value.setDate(value.getDate() + offset)

	return formatDate(value)
}

export function formatDate(date: Date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

function stringValue(formData: FormData, key: string) {
	return String(formData.get(key) ?? '').trim()
}

function formError(message: string, values: MealPlanFormError['values']) {
	return fail(400, { message, values })
}
