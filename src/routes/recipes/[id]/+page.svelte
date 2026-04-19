<script lang="ts">
	let { data } = $props();

	let totalCalories = $derived(
		data.recipe.caloriesPerServing === null ? null : data.recipe.caloriesPerServing * data.recipe.servings
	);
</script>

<svelte:head>
	<title>{data.recipe.name} | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<a href="/recipes" class="text-sm font-medium text-emerald-700">Back to recipes</a>
			<h1 class="mt-2 text-3xl font-semibold text-zinc-950">{data.recipe.name}</h1>
			<p class="mt-2 capitalize text-zinc-600">{data.mealTypes.join(', ')}</p>
		</div>
		<div class="flex gap-2">
			<a href={`/recipes/${data.recipe.id}/edit`} class="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800">
				Edit
			</a>
			<form method="POST" action="?/delete">
				<button class="min-h-11 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-700">
					Delete
				</button>
			</form>
		</div>
	</header>

	<section class="grid gap-3 sm:grid-cols-3">
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<p class="text-sm text-zinc-600">Servings</p>
			<p class="mt-1 text-2xl font-semibold text-zinc-950">{data.recipe.servings}</p>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<p class="text-sm text-zinc-600">Kcal per serving</p>
			<p class="mt-1 text-2xl font-semibold text-zinc-950">{data.recipe.caloriesPerServing ?? 'Not set'}</p>
		</div>
		<div class="rounded-lg border border-zinc-200 bg-white p-4">
			<p class="text-sm text-zinc-600">Total kcal</p>
			<p class="mt-1 text-2xl font-semibold text-zinc-950">{totalCalories ?? 'Not set'}</p>
		</div>
	</section>

	<section>
		<h2 class="text-xl font-semibold text-zinc-950">Ingredients</h2>
		<ul class="mt-3 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
			{#each data.ingredients as ingredient}
				<li class="grid gap-1 p-4 sm:grid-cols-[9rem_1fr]">
					<span class="text-sm font-semibold text-zinc-700">
						{ingredient.quantity ?? ''} {ingredient.unit ?? ''}
					</span>
					<span class="text-zinc-950">
						{ingredient.name}
						{#if ingredient.notes}
							<span class="text-zinc-500">- {ingredient.notes}</span>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	</section>

	{#if data.recipe.instructions}
		<section>
			<h2 class="text-xl font-semibold text-zinc-950">Cooking notes</h2>
			<p class="mt-3 whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 leading-7 text-zinc-700">{data.recipe.instructions}</p>
		</section>
	{/if}
</main>
