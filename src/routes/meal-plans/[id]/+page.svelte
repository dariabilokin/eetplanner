<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.plan.name} | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<a href="/meal-plans" class="text-sm font-medium text-emerald-700">Back to meal plans</a>
			<h1 class="mt-2 text-3xl font-semibold text-zinc-950">{data.plan.name}</h1>
			<p class="mt-2 text-zinc-600">{data.plan.startDate} to {data.plan.endDate}</p>
		</div>
		<form method="POST" action="?/delete">
			<button class="min-h-11 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-700">
				Delete plan
			</button>
		</form>
	</header>

	<section class="grid gap-4">
		{#each data.days as day}
			<article class="rounded-lg border border-zinc-200 bg-white">
				<header class="flex flex-col gap-2 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
					<h2 class="text-xl font-semibold text-zinc-950">{day.date}</h2>
					<div class="flex flex-wrap gap-2 text-sm text-zinc-700">
						<span class="rounded-md bg-amber-100 px-2 py-1">{day.calories === null ? 'Incomplete kcal' : `${day.calories} kcal`}</span>
						<span class="rounded-md bg-emerald-100 px-2 py-1">{day.protein === null ? 'Incomplete protein' : `${day.protein}g protein`}</span>
					</div>
				</header>

				<div class="divide-y divide-zinc-200">
					{#each day.meals as meal}
						<div class="grid gap-3 p-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
							<p class="text-sm font-semibold capitalize text-zinc-700">{meal.mealType}</p>
							<a href={`/recipes/${meal.recipeId}`} class="font-semibold text-zinc-950 hover:text-emerald-700">
								{meal.recipeName}
							</a>
							<div class="flex flex-wrap gap-2 text-sm text-zinc-700 sm:justify-end">
								<span class="rounded-md bg-zinc-100 px-2 py-1">{meal.servings} serving{meal.servings === 1 ? '' : 's'}</span>
								{#if meal.caloriesPerServing !== null}
									<span class="rounded-md bg-amber-100 px-2 py-1">{meal.caloriesPerServing * meal.servings} kcal</span>
								{/if}
								{#if meal.proteinPerServing !== null}
									<span class="rounded-md bg-emerald-100 px-2 py-1">{meal.proteinPerServing * meal.servings}g protein</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</article>
		{/each}
	</section>
</main>
