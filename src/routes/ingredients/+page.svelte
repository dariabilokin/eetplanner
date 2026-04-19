<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Ingredients | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<a href="/" class="text-sm font-medium text-emerald-700">Eetplanner</a>
			<h1 class="mt-2 text-3xl font-semibold text-zinc-950">Ingredients</h1>
			<p class="mt-2 text-zinc-600">Reusable ingredient names for recipes and shopping lists.</p>
		</div>
		<a href="/recipes/new" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
			Add recipe
		</a>
	</header>

	<form method="GET" class="flex flex-col gap-3 sm:flex-row">
		<input
			name="search"
			value={data.search}
			placeholder="Search ingredients"
			class="min-h-11 flex-1 rounded-lg border border-zinc-300 px-3"
		/>
		<button class="min-h-11 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800">Search</button>
	</form>

	{#if data.ingredients.length === 0}
		<section class="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
			<h2 class="text-lg font-semibold text-zinc-950">No ingredients found</h2>
			<p class="mt-2 text-zinc-600">Ingredients are created automatically when you save recipes.</p>
		</section>
	{:else}
		<section class="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
			{#each data.ingredients as ingredient}
				<div class="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
					<div>
						<h2 class="font-semibold text-zinc-950">{ingredient.name}</h2>
						{#if ingredient.defaultUnit}
							<p class="mt-1 text-sm text-zinc-600">Default unit: {ingredient.defaultUnit}</p>
						{/if}
					</div>
					<p class="text-sm text-zinc-600">{ingredient.recipeCount} recipes</p>
				</div>
			{/each}
		</section>
	{/if}
</main>
