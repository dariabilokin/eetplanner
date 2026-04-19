<script lang="ts">
	let { data, form } = $props();

	function formatDate(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	function nextMonday() {
		const date = new Date();
		const day = date.getDay();
		const offset = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
		date.setDate(date.getDate() + offset);

		return formatDate(date);
	}

	const values = $derived(form?.values ?? {
		name: '',
		startDate: nextMonday(),
		days: '7',
		servings: '1',
		mealTypes: ['breakfast', 'lunch', 'dinner', 'snack']
	});

	const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack'];
</script>

<svelte:head>
	<title>Meal plans | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6">
	<header>
		<a href="/" class="app-link text-sm font-medium">Eetplanner</a>
		<h1 class="mt-2 text-3xl font-semibold text-yellow-100">Meal plans</h1>
		<p class="app-muted mt-2">Generate a menu from recipes that match each meal slot.</p>
	</header>

	<section class="grid gap-6 lg:grid-cols-[24rem_1fr]">
		<form method="POST" action="?/generate" class="app-panel grid content-start gap-5 rounded-lg p-4">
			<h2 class="text-xl font-semibold text-yellow-100">Generate plan</h2>

			{#if form?.message}
				<p class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{form.message}</p>
			{/if}

			<label class="grid gap-2">
				<span class="text-sm font-semibold text-yellow-100">Name</span>
				<input name="name" value={values.name} placeholder="Week menu" class="app-input min-h-11 rounded-lg px-3" />
			</label>

			<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
				<label class="grid gap-2">
					<span class="text-sm font-semibold text-yellow-100">Week start</span>
					<input name="startDate" type="date" value={values.startDate} class="app-input min-h-11 rounded-lg px-3" required />
					<span class="app-muted text-sm">Plans start on Monday.</span>
				</label>

				<label class="grid gap-2">
					<span class="text-sm font-semibold text-yellow-100">Days</span>
					<input name="days" type="number" min="1" max="21" value={values.days} class="app-input min-h-11 rounded-lg px-3" required />
				</label>

				<label class="grid gap-2">
					<span class="text-sm font-semibold text-yellow-100">Servings per meal</span>
					<input name="servings" type="number" min="1" value={values.servings} class="app-input min-h-11 rounded-lg px-3" required />
				</label>
			</div>

			<fieldset class="grid gap-2">
				<legend class="text-sm font-semibold text-yellow-100">Meal slots</legend>
				<div class="grid grid-cols-2 gap-2">
					{#each mealTypeOptions as mealType}
						<label class="flex min-h-11 items-center gap-2 rounded-lg border border-yellow-200/30 bg-green-950/50 px-3 text-sm capitalize text-yellow-100">
							<input name="mealTypes" type="checkbox" value={mealType} checked={values.mealTypes.includes(mealType)} />
							{mealType}
						</label>
					{/each}
				</div>
			</fieldset>

			<button class="app-button min-h-11 rounded-lg px-4 text-sm font-semibold">
				Generate meal plan
			</button>
		</form>

		<section class="content-start">
			<div class="flex items-center justify-between gap-3">
				<h2 class="text-xl font-semibold text-yellow-100">Saved plans</h2>
				<a href="/recipes" class="app-link text-sm font-semibold">Manage recipes</a>
			</div>

			{#if data.plans.length === 0}
				<div class="app-panel mt-3 rounded-lg border-dashed p-6">
					<h3 class="text-lg font-semibold text-yellow-100">No meal plans yet</h3>
					<p class="app-muted mt-2">Generate the first plan from your imported recipes.</p>
				</div>
			{:else}
				<div class="mt-3 grid gap-3">
					{#each data.plans as plan}
						<a href={`/meal-plans/${plan.id}`} class="app-panel grid gap-2 rounded-lg p-4 transition hover:border-yellow-200 sm:grid-cols-[1fr_auto]">
							<div>
								<h3 class="font-semibold text-yellow-100">{plan.name}</h3>
								<p class="app-muted mt-1 text-sm">{plan.startDate} to {plan.endDate}</p>
							</div>
							<span class="app-link text-sm font-semibold">Open</span>
						</a>
					{/each}
				</div>
			{/if}
		</section>
	</section>
</main>
