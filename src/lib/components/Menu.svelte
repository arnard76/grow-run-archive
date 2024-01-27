<script>
	import MenuDropDown from './MenuDropDown.svelte';
</script>

<nav>
	<MenuDropDown>
		<p slot="text">Cost</p>
		<a href="/cost/archive">Archive</a>
		<a href="/cost/graph">Graph</a>
	</MenuDropDown>
	<a href="/resources">Resources list</a>
	<a href="/pie-charts">Pies 🥧📊</a>
	<a href="/logout">Logout</a>
</nav>

<style>
	nav {
		display: flex;
		gap: 15px;
		align-items: flex-start;
	}

	a,
	p {
		text-decoration: none;
		padding: 5px;
		background: rgb(0, 115, 255);
		color: white;
		border-radius: 5px;
	}
</style>
