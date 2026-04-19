<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Recipes | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<a href="/" class="text-sm font-medium text-emerald-700">Eetplanner</a>
			<h1 class="mt-2 text-3xl font-semibold text-zinc-950">Recipes</h1>
			<p class="mt-2 text-zinc-600">Your source data for menus and shopping lists.</p>
		</div>
		<a
			href="/recipes/new"
			class="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
		>
			Add recipe
		</a>
	</header>

	{#if data.recipes.length === 0}
		<section class="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
			<h2 class="text-lg font-semibold text-zinc-950">No recipes yet</h2>
			<p class="mt-2 text-zinc-600">Add the first recipe with ingredients, servings, calories, and cooking notes.</p>
			<a href="/recipes/new" class="mt-4 inline-flex text-sm font-semibold text-emerald-700">Create first recipe</a>
		</section>
	{:else}
		<section class="grid gap-3">
			{#each data.recipes as recipe}
				<a
					href={`/recipes/${recipe.id}`}
					class="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-emerald-500 hover:shadow-sm sm:grid-cols-[1fr_auto]"
				>
					<div>
						<h2 class="text-lg font-semibold text-zinc-950">{recipe.name}</h2>
						<p class="mt-1 text-sm capitalize text-zinc-600">{recipe.mealTypes.join(', ')}</p>
					</div>
					<div class="flex flex-wrap gap-2 text-sm text-zinc-700 sm:justify-end">
						<span class="rounded-md bg-zinc-100 px-2 py-1">{recipe.servings} servings</span>
						<span class="rounded-md bg-zinc-100 px-2 py-1">{recipe.ingredientCount} ingredients</span>
						{#if recipe.caloriesPerServing !== null}
							<span class="rounded-md bg-amber-100 px-2 py-1">{recipe.caloriesPerServing} kcal</span>
						{/if}
						{#if recipe.proteinPerServing !== null}
							<span class="rounded-md bg-emerald-100 px-2 py-1">{recipe.proteinPerServing}g protein</span>
						{/if}
					</div>
				</a>
			{/each}
		</section>
	{/if}
</main>
