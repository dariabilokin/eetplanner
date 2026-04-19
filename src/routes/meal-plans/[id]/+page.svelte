<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.plan.name} | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
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

	<section class="grid gap-6">
		{#each data.weeks as week}
			<article class="rounded-lg border border-zinc-200 bg-white">
				<header class="border-b border-zinc-200 p-4">
					<h2 class="text-xl font-semibold text-zinc-950">Week of {week.weekStart}</h2>
				</header>

				<div class="overflow-x-auto">
					<table class="w-full min-w-[980px] table-fixed border-collapse text-left">
						<thead>
							<tr class="border-b border-zinc-200">
								<th class="w-32 bg-zinc-50 p-3 text-sm font-semibold text-zinc-700">Meal</th>
								{#each week.days as day}
									<th class="p-3 align-top">
										<p class="text-sm font-semibold text-zinc-950">{day.label}</p>
										<p class="mt-1 text-xs text-zinc-500">{day.date}</p>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each data.mealTypes as mealType, mealTypeIndex}
								<tr class="border-b border-zinc-200 last:border-b-0">
									<th class="bg-zinc-50 p-3 text-sm font-semibold capitalize text-zinc-700">{mealType}</th>
									{#each week.days as day}
										{@const meal = day.meals[mealTypeIndex]}
										<td class="p-3 align-top">
											{#if meal}
												<a href={`/recipes/${meal.recipeId}`} class="block font-semibold leading-6 text-zinc-950 hover:text-emerald-700">
													{meal.recipeName}
												</a>
												<div class="mt-2 flex flex-wrap gap-1 text-xs text-zinc-700">
													<span class="rounded-md bg-zinc-100 px-2 py-1">{meal.servings} serving{meal.servings === 1 ? '' : 's'}</span>
													{#if meal.caloriesPerServing !== null}
														<span class="rounded-md bg-amber-100 px-2 py-1">{meal.caloriesPerServing * meal.servings} kcal</span>
													{/if}
													{#if meal.proteinPerServing !== null}
														<span class="rounded-md bg-emerald-100 px-2 py-1">{meal.proteinPerServing * meal.servings}g protein</span>
													{/if}
												</div>
											{:else}
												<span class="text-sm text-zinc-400">-</span>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="border-t border-zinc-200">
								<th class="bg-zinc-50 p-3 text-sm font-semibold text-zinc-700">Total</th>
								{#each week.days as day}
									<td class="p-3 align-top text-sm">
										<div class="flex flex-wrap gap-1">
											<span class="rounded-md bg-amber-100 px-2 py-1">{day.calories === null ? 'Incomplete kcal' : `${day.calories} kcal`}</span>
											<span class="rounded-md bg-emerald-100 px-2 py-1">{day.protein === null ? 'Incomplete protein' : `${day.protein}g protein`}</span>
										</div>
									</td>
								{/each}
							</tr>
						</tfoot>
					</table>
				</div>
			</article>
		{/each}
	</section>
</main>
