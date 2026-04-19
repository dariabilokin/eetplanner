<script lang="ts">
	let { data, form } = $props();

	let values = $derived(form?.values ?? {
		name: data.recipe.name,
		mealTypes: data.mealTypes,
		servings: String(data.recipe.servings),
		caloriesPerServing: data.recipe.caloriesPerServing === null ? '' : String(data.recipe.caloriesPerServing),
		proteinPerServing: data.recipe.proteinPerServing === null ? '' : String(data.recipe.proteinPerServing),
		instructions: data.recipe.instructions ?? '',
		ingredientLines: data.ingredientLines
	});

	const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'side'];
</script>

<svelte:head>
	<title>Edit {data.recipe.name} | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header>
		<a href={`/recipes/${data.recipe.id}`} class="text-sm font-medium text-emerald-700">Back to recipe</a>
		<h1 class="mt-2 text-3xl font-semibold text-zinc-950">Edit recipe</h1>
	</header>

	{#if form?.message}
		<p class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{form.message}</p>
	{/if}

	<form method="POST" class="grid gap-5">
		<label class="grid gap-2">
			<span class="text-sm font-semibold text-zinc-800">Name</span>
			<input name="name" value={values.name} class="min-h-11 rounded-lg border border-zinc-300 px-3" required />
		</label>

		<div class="grid gap-5 lg:grid-cols-[20rem_1fr] lg:items-start">
			<fieldset class="grid gap-2">
				<legend class="text-sm font-semibold text-zinc-800">Meal types</legend>
				<div class="grid grid-cols-2 gap-2">
					{#each mealTypeOptions as mealType}
						<label class="flex min-h-11 items-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm capitalize">
							<input name="mealTypes" type="checkbox" value={mealType} checked={values.mealTypes.includes(mealType)} />
							{mealType}
						</label>
					{/each}
				</div>
			</fieldset>

			<div class="grid gap-4 sm:grid-cols-3">
				<label class="grid content-start gap-2">
					<span class="text-sm font-semibold text-zinc-800">Servings</span>
					<input name="servings" type="number" min="1" value={values.servings} class="min-h-11 rounded-lg border border-zinc-300 px-3" required />
				</label>

				<label class="grid content-start gap-2">
					<span class="text-sm font-semibold text-zinc-800">Kcal per serving</span>
					<input name="caloriesPerServing" type="number" min="0" step="1" value={values.caloriesPerServing} class="min-h-11 rounded-lg border border-zinc-300 px-3" />
				</label>

				<label class="grid content-start gap-2">
					<span class="text-sm font-semibold text-zinc-800">Protein grams</span>
					<input name="proteinPerServing" type="number" min="0" step="1" value={values.proteinPerServing} class="min-h-11 rounded-lg border border-zinc-300 px-3" />
				</label>
			</div>
		</div>

		<label class="grid gap-2">
			<span class="text-sm font-semibold text-zinc-800">Ingredients</span>
			<textarea
				name="ingredientLines"
				rows="7"
				class="rounded-lg border border-zinc-300 px-3 py-2"
				required
			>{values.ingredientLines}</textarea>
			<span class="text-sm text-zinc-600">Use one ingredient per line: quantity | unit | name | note.</span>
			<a href="/ingredients" class="text-sm font-semibold text-emerald-700">Search saved ingredients</a>
		</label>

		<label class="grid gap-2">
			<span class="text-sm font-semibold text-zinc-800">Cooking notes</span>
			<textarea name="instructions" rows="6" class="rounded-lg border border-zinc-300 px-3 py-2">{values.instructions}</textarea>
		</label>

		<div class="flex flex-col gap-3 sm:flex-row">
			<button class="min-h-11 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
				Save changes
			</button>
			<a href={`/recipes/${data.recipe.id}`} class="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800">
				Cancel
			</a>
		</div>
	</form>
</main>
