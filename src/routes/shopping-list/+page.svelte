<svelte:head>
	<title>Shopping list | Eetplanner</title>
</svelte:head>

<main class="app-page mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header>
		<a href="/" class="app-link text-sm font-medium">Eetplanner</a>
		<h1 class="mt-2 text-3xl font-semibold text-[var(--color-deep)]">Shopping list</h1>
		<p class="app-muted mt-2">This will collect ingredients from a saved meal plan and group repeated items.</p>
	</header>

	<section class="app-panel rounded-lg border-dashed p-6">
		<h2 class="text-lg font-semibold text-[var(--color-deep)]">Waiting for meal plans</h2>
		<p class="app-muted mt-2">Once menus exist, this page can show ingredients with the meals that use them.</p>
		<a href="/recipes" class="app-link mt-4 inline-flex text-sm font-semibold">Go to recipes</a>
	</section>
</main>
