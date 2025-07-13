<script>
	import MenuDropDown from './MenuDropDown.svelte';
</script>

<nav class="flex gap-[15px] items-start">
	<a href="/grow-runs">Grow Runs</a>
	<a href="/resources">Resources</a>
	<MenuDropDown>
		<p slot="text" class="nav-item">Cost</p>
		<a href="/cost/graph">Graph</a>
		<a href="/cost/pie-charts">Pies 🥧📊</a>
	</MenuDropDown>
</nav>
