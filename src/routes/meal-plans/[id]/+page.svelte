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
			<h1 class="mt-2 text-3xl font-semibold text-[var(--color-cream)]">{data.plan.name}</h1>
			<p class="app-muted mt-2">{data.plan.startDate} to {data.plan.endDate}</p>
		</div>
		<div class="flex flex-col gap-3 sm:items-end">
			<form method="POST" action="?/delete">
				<button class="app-danger min-h-11 rounded-lg border px-4 text-sm font-semibold">
					Delete week
				</button>
			</form>
			<div class="inline-flex rounded-lg border app-border app-surface-soft p-1">
				<button
					type="button"
					class={`min-h-10 rounded-md px-3 text-sm font-semibold ${viewMode === 'table' ? 'app-badge text-[var(--color-deep)]' : 'text-[var(--color-cream)] hover:bg-[rgba(42,157,143,0.32)]'}`}
					onclick={() => (viewMode = 'table')}
				>
					Week
				</button>
				<button
					type="button"
					class={`min-h-10 rounded-md px-3 text-sm font-semibold ${viewMode === 'day' ? 'app-badge text-[var(--color-deep)]' : 'text-[var(--color-cream)] hover:bg-[rgba(42,157,143,0.32)]'}`}
					onclick={() => (viewMode = 'day')}
				>
					Day
				</button>
			</div>
		</div>
	</header>

	{#if viewMode === 'table'}
		<section class="grid gap-6">
			{#each data.weeks as week}
				<article class="app-panel-strong overflow-hidden rounded-lg">
					<header class="border-b app-border app-surface p-4">
						<h2 class="text-xl font-semibold text-[var(--color-cream)]">Week of {week.weekStart}</h2>
					</header>

					<div class="overflow-x-auto">
						<table class="w-full min-w-[1060px] table-fixed border-separate border-spacing-0 text-left">
							<thead class="sticky top-0 z-30 shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
								<tr>
									<th class="app-border sticky left-0 z-40 w-32 border-b border-r bg-[var(--color-teal)] p-3 text-sm font-semibold text-[var(--color-cream)]">Meal</th>
									{#each week.days as day}
										<th class="app-border border-b border-r p-3 align-top odd:bg-[rgba(42,157,143,0.9)] even:bg-[rgba(244,162,97,0.78)]">
											<p class="text-sm font-semibold text-[var(--color-cream)]">{day.label}</p>
											<p class="mt-1 text-xs text-[var(--color-deep)]">{day.date}</p>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each data.mealTypes as mealType, mealTypeIndex}
									<tr>
										<th class="sticky left-0 z-10 border-b border-r app-border app-surface p-3 text-sm font-semibold capitalize text-[var(--color-cream)]">{mealType}</th>
										{#each week.days as day}
											{@const meal = day.meals[mealTypeIndex]}
											<td class="app-border border-b border-r p-3 align-top odd:bg-[rgba(38,70,83,0.72)] even:bg-[rgba(42,157,143,0.24)]">
												{#if meal}
													<a href={`/recipes/${meal.recipeId}`} class="block font-semibold leading-6 text-[var(--color-cream)] hover:text-white">
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
					<header class="flex flex-col gap-2 border-b app-border app-surface p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 class="text-xl font-semibold text-[var(--color-cream)]">{day.label}</h2>
							<p class="app-muted mt-1 text-sm">{day.date}</p>
						</div>
						<div class="flex flex-wrap gap-1 text-sm">
							<span class="rounded-md app-badge px-2 py-1 text-[var(--color-deep)]">{day.calories === null ? 'Incomplete kcal' : `${day.calories} kcal`}</span>
							<span class="rounded-md app-badge-alt px-2 py-1 text-[var(--color-deep)]">{day.protein === null ? 'Incomplete protein' : `${day.protein}g protein`}</span>
						</div>
					</header>

					<div class="divide-y divide-[rgba(233,196,106,0.22)]">
						{#each data.mealTypes as mealType, mealTypeIndex}
							{@const meal = day.meals[mealTypeIndex]}
							<div class="grid gap-3 p-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
								<p class="text-sm font-semibold capitalize text-[var(--color-cream)]">{mealType}</p>
								{#if meal}
									<a href={`/recipes/${meal.recipeId}`} class="font-semibold text-[var(--color-cream)] hover:text-white">
										{meal.recipeName}
									</a>
									<div class="flex flex-wrap gap-1 text-xs text-[var(--color-deep)] sm:justify-end">
										<span class="rounded-md app-badge px-2 py-1">{meal.servings} serving{meal.servings === 1 ? '' : 's'}</span>
										{#if meal.caloriesPerServing !== null}
											<span class="rounded-md app-badge px-2 py-1">{meal.caloriesPerServing * meal.servings} kcal</span>
										{/if}
										{#if meal.proteinPerServing !== null}
											<span class="rounded-md app-badge-alt px-2 py-1">{meal.proteinPerServing * meal.servings}g protein</span>
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
