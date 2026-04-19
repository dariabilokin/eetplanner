<script lang="ts">
	let { data } = $props();

	let totalCalories = $derived(
		data.recipe.caloriesPerServing === null ? null : data.recipe.caloriesPerServing * data.recipe.servings
	);
	let totalProtein = $derived(
		data.recipe.proteinPerServing === null ? null : data.recipe.proteinPerServing * data.recipe.servings
	);
</script>

<svelte:head>
	<title>{data.recipe.name} | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<a href="/recipes" class="app-link text-sm font-medium">Back to recipes</a>
			<h1 class="mt-2 text-3xl font-semibold text-[var(--color-deep)]">{data.recipe.name}</h1>
			<p class="app-muted mt-2 capitalize">{data.mealTypes.join(', ')}</p>
		</div>
		<div class="flex gap-2">
			<a href={`/recipes/${data.recipe.id}/edit`} class="inline-flex min-h-11 items-center justify-center rounded-lg border app-border px-4 text-sm font-semibold text-[var(--color-deep)] hover:bg-[rgba(42,157,143,0.12)]">
				Edit
			</a>
			<form method="POST" action="?/delete">
				<button class="app-danger min-h-11 rounded-lg border px-4 text-sm font-semibold">
					Delete
				</button>
			</form>
		</div>
	</header>

	<section class="grid gap-3 sm:grid-cols-4">
		<div class="app-panel rounded-lg p-4">
			<p class="app-muted text-sm">Servings</p>
			<p class="mt-1 text-2xl font-semibold text-[var(--color-deep)]">{data.recipe.servings}</p>
		</div>
		<div class="app-panel rounded-lg p-4">
			<p class="app-muted text-sm">Kcal per serving</p>
			<p class="mt-1 text-2xl font-semibold text-[var(--color-deep)]">{data.recipe.caloriesPerServing ?? 'Not set'}</p>
		</div>
		<div class="app-panel rounded-lg p-4">
			<p class="app-muted text-sm">Total kcal</p>
			<p class="mt-1 text-2xl font-semibold text-[var(--color-deep)]">{totalCalories ?? 'Not set'}</p>
		</div>
		<div class="app-panel rounded-lg p-4">
			<p class="app-muted text-sm">Protein</p>
			<p class="mt-1 text-2xl font-semibold text-[var(--color-deep)]">
				{#if data.recipe.proteinPerServing === null}
					Not set
				{:else}
					{data.recipe.proteinPerServing}g / {totalProtein}g
				{/if}
			</p>
		</div>
	</section>

	<section>
		<h2 class="text-xl font-semibold text-[var(--color-deep)]">Ingredients</h2>
		<ul class="app-panel mt-3 divide-y divide-[rgba(233,196,106,0.22)] rounded-lg">
			{#each data.ingredients as ingredient}
				<li class="grid gap-1 p-4 sm:grid-cols-[9rem_1fr]">
					<span class="app-muted text-sm font-semibold">
						{ingredient.quantity ?? ''} {ingredient.unit ?? ''}
					</span>
					<span class="text-[var(--color-deep)]">
						{ingredient.name}
						{#if ingredient.notes}
							<span class="app-muted">- {ingredient.notes}</span>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	</section>

	{#if data.recipe.instructions}
		<section>
			<h2 class="text-xl font-semibold text-[var(--color-deep)]">Cooking notes</h2>
			<p class="app-panel mt-3 whitespace-pre-wrap rounded-lg p-4 leading-7">{data.recipe.instructions}</p>
		</section>
	{/if}
</main>
