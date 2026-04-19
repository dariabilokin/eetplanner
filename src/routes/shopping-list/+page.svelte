<svelte:head>
	<title>Shopping list | Eetplanner</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
	<header>
		<a href="/" class="text-sm font-medium text-emerald-700">Eetplanner</a>
		<h1 class="mt-2 text-3xl font-semibold text-zinc-950">Shopping list</h1>
		<p class="mt-2 text-zinc-600">This will collect ingredients from a saved meal plan and group repeated items.</p>
	</header>

	<section class="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
		<h2 class="text-lg font-semibold text-zinc-950">Waiting for meal plans</h2>
		<p class="mt-2 text-zinc-600">Once menus exist, this page can show ingredients with the meals that use them.</p>
		<a href="/recipes" class="mt-4 inline-flex text-sm font-semibold text-emerald-700">Go to recipes</a>
	</section>
</main>
