<script lang="ts">
	let { form } = $props();

	let values = $derived(form?.values ?? {
		name: '',
		mealTypes: ['dinner'],
		servings: '2',
		caloriesPerServing: '',
		proteinPerServing: '',
		instructions: '',
		ingredientLines: ''
	});

	const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'side'];
</script>

<svelte:head>
	<title>Add recipe | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header>
		<a href="/recipes" class="app-link text-sm font-medium">Back to recipes</a>
		<h1 class="mt-2 text-3xl font-semibold text-yellow-100">Add recipe</h1>
	</header>

	{#if form?.message}
		<p class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{form.message}</p>
	{/if}

	<form method="POST" class="app-panel grid gap-5 rounded-lg p-4">
		<label class="grid gap-2">
			<span class="text-sm font-semibold text-yellow-100">Name</span>
			<input name="name" value={values.name} class="app-input min-h-11 rounded-lg px-3" required />
		</label>

		<div class="grid gap-5 lg:grid-cols-[20rem_1fr] lg:items-start">
			<fieldset class="grid gap-2">
				<legend class="text-sm font-semibold text-yellow-100">Meal types</legend>
				<div class="grid grid-cols-2 gap-2">
					{#each mealTypeOptions as mealType}
						<label class="flex min-h-11 items-center gap-2 rounded-lg border border-yellow-200/30 bg-green-950/50 px-3 text-sm capitalize text-yellow-100">
							<input name="mealTypes" type="checkbox" value={mealType} checked={values.mealTypes.includes(mealType)} />
							{mealType}
						</label>
					{/each}
				</div>
			</fieldset>

			<div class="grid gap-4 sm:grid-cols-3">
				<label class="grid content-start gap-2">
					<span class="text-sm font-semibold text-yellow-100">Servings</span>
					<input name="servings" type="number" min="1" value={values.servings} class="app-input min-h-11 rounded-lg px-3" required />
				</label>

				<label class="grid content-start gap-2">
					<span class="text-sm font-semibold text-yellow-100">Kcal per serving</span>
					<input name="caloriesPerServing" type="number" min="0" step="1" value={values.caloriesPerServing} class="app-input min-h-11 rounded-lg px-3" />
				</label>

				<label class="grid content-start gap-2">
					<span class="text-sm font-semibold text-yellow-100">Protein grams</span>
					<input name="proteinPerServing" type="number" min="0" step="1" value={values.proteinPerServing} class="app-input min-h-11 rounded-lg px-3" />
				</label>
			</div>
		</div>

		<label class="grid gap-2">
			<span class="text-sm font-semibold text-yellow-100">Ingredients</span>
			<textarea
				name="ingredientLines"
				rows="7"
				class="app-input rounded-lg px-3 py-2"
				placeholder={'200 | g | rice | basmati\n2 | pcs | eggs\n1 | tbsp | olive oil'}
				required
			>{values.ingredientLines}</textarea>
			<span class="app-muted text-sm">Use one ingredient per line: quantity | unit | name | note.</span>
			<a href="/ingredients" class="app-link text-sm font-semibold">Search saved ingredients</a>
		</label>

		<label class="grid gap-2">
			<span class="text-sm font-semibold text-yellow-100">Cooking notes</span>
			<textarea name="instructions" rows="6" class="app-input rounded-lg px-3 py-2">{values.instructions}</textarea>
		</label>

		<div class="flex flex-col gap-3 sm:flex-row">
			<button class="app-button min-h-11 rounded-lg px-4 text-sm font-semibold">
				Save recipe
			</button>
			<a href="/recipes" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-yellow-200/30 px-4 text-sm font-semibold text-yellow-100 hover:bg-green-950/50">
				Cancel
			</a>
		</div>
	</form>
</main>
