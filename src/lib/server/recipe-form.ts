import { fail, type ActionFailure } from '@sveltejs/kit'

export type RecipeFormInput = {
	name: string
	mealTypes: string[]
	servings: number
	caloriesPerServing: number | null
	proteinPerServing: number | null
	instructions: string | null
	ingredients: ParsedIngredient[]
}

export type ParsedIngredient = {
	name: string
	quantity: number | null
	unit: string | null
	notes: string | null
}

export type RecipeFormError = {
	message: string
	values: {
		name: string
		mealTypes: string[]
		servings: string
		caloriesPerServing: string
		proteinPerServing: string
		instructions: string
		ingredientLines: string
	}
}

const mealTypes = new Set(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'side'])

export function parseRecipeForm(formData: FormData): RecipeFormInput | ActionFailure<RecipeFormError> {
	const values = {
		name: stringValue(formData, 'name'),
		mealTypes: formData.getAll('mealTypes').map(String),
		servings: stringValue(formData, 'servings'),
		caloriesPerServing: stringValue(formData, 'caloriesPerServing'),
		proteinPerServing: stringValue(formData, 'proteinPerServing'),
		instructions: stringValue(formData, 'instructions'),
		ingredientLines: stringValue(formData, 'ingredientLines')
	}

	const servings = Number(values.servings)
	const caloriesPerServing = values.caloriesPerServing ? Number(values.caloriesPerServing) : null
	const proteinPerServing = values.proteinPerServing ? Number(values.proteinPerServing) : null
	const ingredients = parseIngredientLines(values.ingredientLines)

	if (!values.name) {
		return formError('Recipe name is required.', values)
	}

	if (values.mealTypes.length === 0 || values.mealTypes.some((mealType) => !mealTypes.has(mealType))) {
		return formError('Choose at least one valid meal type.', values)
	}

	if (!Number.isInteger(servings) || servings < 1) {
		return formError('Servings must be a whole number greater than 0.', values)
	}

	if (caloriesPerServing !== null && (!Number.isFinite(caloriesPerServing) || caloriesPerServing < 0)) {
		return formError('Calories per serving must be 0 or higher.', values)
	}

	if (proteinPerServing !== null && (!Number.isFinite(proteinPerServing) || proteinPerServing < 0)) {
		return formError('Protein per serving must be 0 or higher.', values)
	}

	if (ingredients.length === 0) {
		return formError('Add at least one ingredient.', values)
	}

	return {
		name: values.name,
		mealTypes: [...new Set(values.mealTypes)],
		servings,
		caloriesPerServing,
		proteinPerServing,
		instructions: values.instructions || null,
		ingredients
	}
}

export function ingredientLinesFromRows(
	ingredients: Array<{ name: string; quantity: number | null; unit: string | null; notes: string | null }>
) {
	return ingredients
		.map((ingredient) =>
			[
				ingredient.quantity ?? '',
				ingredient.unit ?? '',
				ingredient.name,
				ingredient.notes ?? ''
			].join(' | ')
		)
		.join('\n')
}

function parseIngredientLines(value: string): ParsedIngredient[] {
	return value
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [quantityValue = '', unitValue = '', nameValue = '', notesValue = ''] = line
				.split('|')
				.map((part) => part.trim())

			const quantity = quantityValue ? Number(quantityValue) : null

			return {
				name: nameValue || line,
				quantity: Number.isFinite(quantity) ? quantity : null,
				unit: unitValue || null,
				notes: notesValue || null
			}
		})
		.filter((ingredient) => ingredient.name.length > 0)
}

function stringValue(formData: FormData, key: string) {
	return String(formData.get(key) ?? '').trim()
}

function formError(message: string, values: RecipeFormError['values']) {
	return fail(400, { message, values })
}
