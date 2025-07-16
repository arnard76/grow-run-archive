<script lang="ts">
	import PieGraph from '$lib/components/PieGraph.svelte';
	import type GrowRun from '..';

	export let growRun: GrowRun;
	$: pieChartData = growRun.formatDataForPieChart();
</script>

<PieGraph pie={pieChartData} sort="alphabet" />
