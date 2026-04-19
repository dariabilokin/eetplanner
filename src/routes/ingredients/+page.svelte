<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Ingredients | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<a href="/" class="app-link text-sm font-medium">Eetplanner</a>
			<h1 class="mt-2 text-3xl font-semibold text-yellow-100">Ingredients</h1>
			<p class="app-muted mt-2">Reusable ingredient names for recipes and shopping lists.</p>
		</div>
		<a href="/recipes/new" class="app-button inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold">
			Add recipe
		</a>
	</header>

	<form method="GET" class="flex flex-col gap-3 sm:flex-row">
		<input
			name="search"
			value={data.search}
			placeholder="Search ingredients"
			class="app-input min-h-11 flex-1 rounded-lg px-3"
		/>
		<button class="app-button min-h-11 rounded-lg px-4 text-sm font-semibold">Search</button>
	</form>

	{#if data.ingredients.length === 0}
		<section class="app-panel rounded-lg border-dashed p-6">
			<h2 class="text-lg font-semibold text-yellow-100">No ingredients found</h2>
			<p class="app-muted mt-2">Ingredients are created automatically when you save recipes.</p>
		</section>
	{:else}
		<section class="app-panel divide-y divide-yellow-200/20 rounded-lg">
			{#each data.ingredients as ingredient}
				<div class="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
					<div>
						<h2 class="font-semibold text-yellow-100">{ingredient.name}</h2>
						{#if ingredient.defaultUnit}
							<p class="app-muted mt-1 text-sm">Default unit: {ingredient.defaultUnit}</p>
						{/if}
					</div>
					<p class="app-muted text-sm">{ingredient.recipeCount} recipes</p>
				</div>
			{/each}
		</section>
	{/if}
</main>
