<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Recipes | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<a href="/" class="app-link text-sm font-medium">Eetplanner</a>
			<h1 class="mt-2 text-3xl font-semibold text-yellow-100">Recipes</h1>
			<p class="app-muted mt-2">Your source data for menus and shopping lists.</p>
		</div>
		<a
			href="/recipes/new"
			class="app-button inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold"
		>
			Add recipe
		</a>
	</header>

	{#if data.recipes.length === 0}
		<section class="app-panel rounded-lg border-dashed p-6">
			<h2 class="text-lg font-semibold text-yellow-100">No recipes yet</h2>
			<p class="app-muted mt-2">Add the first recipe with ingredients, servings, calories, and cooking notes.</p>
			<a href="/recipes/new" class="app-link mt-4 inline-flex text-sm font-semibold">Create first recipe</a>
		</section>
	{:else}
		<section class="grid gap-3">
			{#each data.recipes as recipe}
				<a
					href={`/recipes/${recipe.id}`}
					class="app-panel grid gap-3 rounded-lg p-4 transition hover:border-yellow-200 sm:grid-cols-[1fr_auto]"
				>
					<div>
						<h2 class="text-lg font-semibold text-yellow-100">{recipe.name}</h2>
						<p class="app-muted mt-1 text-sm capitalize">{recipe.mealTypes.join(', ')}</p>
					</div>
					<div class="flex flex-wrap gap-2 text-sm text-green-950 sm:justify-end">
						<span class="rounded-md bg-yellow-100 px-2 py-1">{recipe.servings} servings</span>
						<span class="rounded-md bg-yellow-100 px-2 py-1">{recipe.ingredientCount} ingredients</span>
						{#if recipe.caloriesPerServing !== null}
							<span class="rounded-md bg-[#f0bf43] px-2 py-1">{recipe.caloriesPerServing} kcal</span>
						{/if}
						{#if recipe.proteinPerServing !== null}
							<span class="rounded-md bg-[#a8d98f] px-2 py-1">{recipe.proteinPerServing}g protein</span>
						{/if}
					</div>
				</a>
			{/each}
		</section>
	{/if}
</main>
