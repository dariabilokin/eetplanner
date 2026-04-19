<script lang="ts">
	const links = [
		{
			href: '/recipes',
			title: 'Recipes',
			text: 'Add meals, ingredients, calories, and cooking notes.'
		},
		{
			href: '/meal-plans',
			title: 'Meal plans',
			text: 'Build weekly menus from saved recipes.'
		},
		{
			href: '/shopping-list',
			title: 'Shopping list',
			text: 'Collect ingredients from planned meals.'
		},
		{
			href: '/ingredients',
			title: 'Ingredients',
			text: 'Search reusable ingredients as your recipe database grows.'
		}
	];
</script>

<svelte:head>
	<title>Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
	<section class="flex flex-col gap-4">
		<p class="text-sm font-semibold uppercase tracking-wide text-[var(--color-mustard)]">Eetplanner</p>
		<h1 class="max-w-3xl text-4xl font-semibold text-[var(--color-cream)] sm:text-5xl">Plan meals without rebuilding the same list every week.</h1>
		<p class="app-muted max-w-2xl text-lg">
			Start with recipes. Menus, calorie totals, and shopping lists will build from that data.
		</p>
	</section>

	<section class="grid gap-3 sm:grid-cols-4">
		{#each links as link}
			<a
				href={link.href}
				class="app-panel rounded-lg p-4 transition hover:border-[var(--color-orange)]"
			>
				<h2 class="text-lg font-semibold text-[var(--color-cream)]">{link.title}</h2>
				<p class="app-muted mt-2 text-sm leading-6">{link.text}</p>
			</a>
		{/each}
	</section>
</main>
