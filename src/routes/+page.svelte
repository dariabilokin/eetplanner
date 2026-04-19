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

<main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
	<section class="flex flex-col gap-4">
		<p class="text-sm font-semibold uppercase tracking-wide text-emerald-700">Eetplanner</p>
		<h1 class="max-w-3xl text-4xl font-semibold text-zinc-950 sm:text-5xl">Plan meals without rebuilding the same list every week.</h1>
		<p class="max-w-2xl text-lg text-zinc-700">
			Start with recipes. Menus, calorie totals, and shopping lists will build from that data.
		</p>
	</section>

	<section class="grid gap-3 sm:grid-cols-4">
		{#each links as link}
			<a
				href={link.href}
				class="rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-emerald-500 hover:shadow-sm"
			>
				<h2 class="text-lg font-semibold text-zinc-950">{link.title}</h2>
				<p class="mt-2 text-sm leading-6 text-zinc-600">{link.text}</p>
			</a>
		{/each}
	</section>
</main>
