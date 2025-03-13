<script>
	import MenuDropDown from './MenuDropDown.svelte';
</script>

<nav class="flex gap-[15px] items-start">
	<a href="/grow-runs">Grow Runs</a>
	<MenuDropDown>
		<p slot="text">Cost</p>
		<a href="/cost/graph">Graph</a>
		<a href="/cost/pie-charts">Pies 🥧📊</a>
	</MenuDropDown>
	<a href="/resources">Resources list</a>
</nav>
