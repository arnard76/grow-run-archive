<script>
	import MenuDropDown from './MenuDropDown.svelte';
</script>

<nav>
	<MenuDropDown>
		<p slot="text">Cost</p>
		<a href="/cost/archive">Archive</a>
		<a href="/cost/graph">Graph</a>
		<a href="/cost/pie-charts">Pies 🥧📊</a>
	</MenuDropDown>
	<a href="/resources">Resources list</a>
</nav>

<style lang="postcss">
	nav {
		display: flex;
		gap: 15px;
		align-items: flex-start;
	}

	p,
	a {
		@apply nav-item;
	}
</style>
