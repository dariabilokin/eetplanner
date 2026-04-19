<script lang="ts">
	let { data } = $props();
	let viewMode = $state<'table' | 'day'>('table');

	const allDays = $derived(data.weeks.flatMap((week) => week.days));
</script>

<svelte:head>
	<title>{data.plan.name} | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<a href="/meal-plans" class="app-link text-sm font-medium">Back to meal plans</a>
			<h1 class="mt-2 text-3xl font-semibold text-yellow-100">{data.plan.name}</h1>
			<p class="app-muted mt-2">{data.plan.startDate} to {data.plan.endDate}</p>
		</div>
		<div class="flex flex-col gap-3 sm:items-end">
			<div class="inline-flex rounded-lg border border-yellow-200/30 bg-green-950/50 p-1">
				<button
					type="button"
					class={`min-h-10 rounded-md px-3 text-sm font-semibold ${viewMode === 'table' ? 'bg-[#f0bf43] text-green-950' : 'text-yellow-100 hover:bg-green-900/70'}`}
					onclick={() => (viewMode = 'table')}
				>
					Table
				</button>
				<button
					type="button"
					class={`min-h-10 rounded-md px-3 text-sm font-semibold ${viewMode === 'day' ? 'bg-[#f0bf43] text-green-950' : 'text-yellow-100 hover:bg-green-900/70'}`}
					onclick={() => (viewMode = 'day')}
				>
					Day
				</button>
			</div>
			<form method="POST" action="?/delete">
				<button class="min-h-11 rounded-lg border border-red-300 bg-red-950/30 px-4 text-sm font-semibold text-red-100 hover:bg-red-900/50">
					Delete plan
				</button>
			</form>
		</div>
	</header>

	{#if viewMode === 'table'}
		<section class="grid gap-6">
			{#each data.weeks as week}
				<article class="app-panel-strong overflow-hidden rounded-lg">
					<header class="border-b border-yellow-200/25 bg-green-950/70 p-4">
						<h2 class="text-xl font-semibold text-yellow-100">Week of {week.weekStart}</h2>
					</header>

					<div class="overflow-x-auto">
						<table class="w-full min-w-[1060px] table-fixed border-separate border-spacing-0 text-left">
							<thead>
								<tr>
									{#each week.days as day}
										<th class="border-b border-r border-yellow-200/25 p-3 align-top odd:bg-[#153f29] even:bg-[#1f4e2c]">
											<p class="text-sm font-semibold text-yellow-100">{day.label}</p>
											<p class="app-muted mt-1 text-xs">{day.date}</p>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each data.mealTypes as mealType, mealTypeIndex}
									<tr>
										<th class="sticky left-0 z-10 border-b border-r border-yellow-200/25 bg-green-950 p-3 text-sm font-semibold capitalize text-yellow-100">{mealType}</th>
										{#each week.days as day}
											{@const meal = day.meals[mealTypeIndex]}
											<td class="border-b border-r border-yellow-200/15 p-3 align-top odd:bg-[#17452c]/95 even:bg-[#225633]/95">
												{#if meal}
													<a href={`/recipes/${meal.recipeId}`} class="block font-semibold leading-6 text-yellow-100 hover:text-white">
														{meal.recipeName}
													</a>
												{:else}
													<span class="app-muted text-sm">-</span>
												{/if}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</article>
			{/each}
		</section>
	{:else}
		<section class="grid gap-4">
			{#each allDays as day}
				<article class="app-panel-strong overflow-hidden rounded-lg">
					<header class="flex flex-col gap-2 border-b border-yellow-200/25 bg-green-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 class="text-xl font-semibold text-yellow-100">{day.label}</h2>
							<p class="app-muted mt-1 text-sm">{day.date}</p>
						</div>
						<div class="flex flex-wrap gap-1 text-sm">
							<span class="rounded-md bg-[#f0bf43] px-2 py-1 text-green-950">{day.calories === null ? 'Incomplete kcal' : `${day.calories} kcal`}</span>
							<span class="rounded-md bg-[#a8d98f] px-2 py-1 text-green-950">{day.protein === null ? 'Incomplete protein' : `${day.protein}g protein`}</span>
						</div>
					</header>

					<div class="divide-y divide-yellow-200/20">
						{#each data.mealTypes as mealType, mealTypeIndex}
							{@const meal = day.meals[mealTypeIndex]}
							<div class="grid gap-3 p-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
								<p class="text-sm font-semibold capitalize text-yellow-100">{mealType}</p>
								{#if meal}
									<a href={`/recipes/${meal.recipeId}`} class="font-semibold text-yellow-100 hover:text-white">
										{meal.recipeName}
									</a>
									<div class="flex flex-wrap gap-1 text-xs text-green-950 sm:justify-end">
										<span class="rounded-md bg-yellow-100 px-2 py-1">{meal.servings} serving{meal.servings === 1 ? '' : 's'}</span>
										{#if meal.caloriesPerServing !== null}
											<span class="rounded-md bg-[#f0bf43] px-2 py-1">{meal.caloriesPerServing * meal.servings} kcal</span>
										{/if}
										{#if meal.proteinPerServing !== null}
											<span class="rounded-md bg-[#a8d98f] px-2 py-1">{meal.proteinPerServing * meal.servings}g protein</span>
										{/if}
									</div>
								{:else}
									<span class="app-muted">-</span>
								{/if}
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</section>
	{/if}
</main>
