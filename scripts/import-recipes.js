import Database from 'better-sqlite3'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const categoryMealTypes = {
	breakfast: ['breakfast'],
	lunch: ['lunch'],
	dinner: ['dinner'],
	snack: ['snack'],
	breakfast_or_lunch: ['breakfast', 'lunch'],
	lunch_or_salad: ['lunch'],
	salad: ['lunch', 'side'],
	protein_add_on: ['side'],
	shake: ['snack']
}

const inputPath = process.argv[2]
const dbPath = process.argv[3] ?? './data/eetplanner.db'

if (!inputPath) {
	console.error('Usage: npm run import:recipes -- <recipes-json-path> [db-path]')
	process.exit(1)
}

const resolvedInputPath = resolve(inputPath)
const resolvedDbPath = resolve(dbPath)

if (!existsSync(resolvedInputPath)) {
	console.error(`Recipe file not found: ${resolvedInputPath}`)
	process.exit(1)
}

if (!existsSync(resolvedDbPath)) {
	console.error(`Database file not found: ${resolvedDbPath}`)
	console.error('Run npm run db:migrate first.')
	process.exit(1)
}

const data = JSON.parse(readFileSync(resolvedInputPath, 'utf8'))

if (!Array.isArray(data.recipes)) {
	console.error('Expected JSON shape: { "recipes": [...] }')
	process.exit(1)
}

const db = new Database(resolvedDbPath)
db.pragma('foreign_keys = ON')

const now = () => new Date().toISOString()
const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, ' ')

const findRecipe = db.prepare('SELECT id FROM recipes WHERE source_id = ?')
const insertRecipe = db.prepare(`
	INSERT INTO recipes (source_id, name, servings, calories_per_serving, protein_per_serving, instructions, created_at, updated_at)
	VALUES (@sourceId, @name, @servings, @caloriesPerServing, @proteinPerServing, @instructions, @createdAt, @updatedAt)
`)
const updateRecipe = db.prepare(`
	UPDATE recipes
	SET name = @name,
		servings = @servings,
		calories_per_serving = @caloriesPerServing,
		protein_per_serving = @proteinPerServing,
		instructions = @instructions,
		updated_at = @updatedAt
	WHERE id = @id
`)
const deleteMealTypes = db.prepare('DELETE FROM recipe_meal_types WHERE recipe_id = ?')
const insertMealType = db.prepare('INSERT OR IGNORE INTO recipe_meal_types (recipe_id, meal_type) VALUES (?, ?)')
const deleteRecipeIngredients = db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?')
const findIngredient = db.prepare('SELECT id FROM ingredients WHERE normalized_name = ?')
const insertIngredient = db.prepare(`
	INSERT INTO ingredients (name, normalized_name, default_unit, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?)
`)
const insertRecipeIngredient = db.prepare(`
	INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
	VALUES (?, ?, ?, ?, ?)
`)

const importRecipes = db.transaction((recipes) => {
	let created = 0
	let updated = 0

	for (const recipe of recipes) {
		const timestamp = now()
		const servings = Number(recipe.servings) || 1
		const instructions = Array.isArray(recipe.steps) ? recipe.steps.join('\n') : null
		const caloriesPerServing = recipe.approx_nutrition?.kcal ? recipe.approx_nutrition.kcal / servings : null
		const proteinPerServing = recipe.approx_nutrition?.protein_g ? recipe.approx_nutrition.protein_g / servings : null
		const sourceId = String(recipe.id)
		const existing = findRecipe.get(sourceId)
		let recipeId

		if (existing) {
			recipeId = existing.id
			updateRecipe.run({
				id: recipeId,
				name: recipe.name,
				servings,
				caloriesPerServing,
				proteinPerServing,
				instructions,
				updatedAt: timestamp
			})
			updated += 1
		} else {
			const result = insertRecipe.run({
				sourceId,
				name: recipe.name,
				servings,
				caloriesPerServing,
				proteinPerServing,
				instructions,
				createdAt: timestamp,
				updatedAt: timestamp
			})
			recipeId = result.lastInsertRowid
			created += 1
		}

		deleteMealTypes.run(recipeId)
		for (const mealType of mealTypesForCategory(recipe.category)) {
			insertMealType.run(recipeId, mealType)
		}

		deleteRecipeIngredients.run(recipeId)
		for (const recipeIngredient of recipe.ingredients ?? []) {
			const name = String(recipeIngredient.item ?? '').trim()
			if (!name) {
				continue
			}

			const normalizedName = normalize(name)
			let ingredient = findIngredient.get(normalizedName)

			if (!ingredient) {
				const ingredientTimestamp = now()
				const result = insertIngredient.run(
					name,
					normalizedName,
					recipeIngredient.unit ?? null,
					ingredientTimestamp,
					ingredientTimestamp
				)
				ingredient = { id: result.lastInsertRowid }
			}

			insertRecipeIngredient.run(
				recipeId,
				ingredient.id,
				recipeIngredient.amount ?? null,
				recipeIngredient.unit ?? null,
				recipeIngredient.notes ?? null
			)
		}
	}

	return { created, updated }
})

const result = importRecipes(data.recipes)
console.log(`Imported ${data.recipes.length} recipes: ${result.created} created, ${result.updated} updated.`)

function mealTypesForCategory(category) {
	const mealTypes = categoryMealTypes[category]

	if (!mealTypes) {
		console.warn(`Unknown category "${category}", importing as snack.`)
		return ['snack']
	}

	return mealTypes
}
