<script lang="ts">
	import Chart from 'chart.js/auto';

	export let pie: { size: number; label: string; colour?: string }[] = [
		{ size: 1, label: 'no label' }
	];

	export let sort: string | undefined = undefined;

	$: pie =
		sort === 'alphabet'
			? pie.sort((slice1, slice2) => (slice1.label < slice2.label ? -1 : 1))
			: pie;

	$: data = {
		labels: pie.map((slice) => slice.label),

		datasets: [
			{
				data: pie.map((slice) => slice.size),
				backgroundColor: pie.map((slice) => slice.colour)
			}
		]
	};

	let canvas: HTMLCanvasElement | undefined;
	let pieChart: Chart<'pie', number[], string> | undefined;

	$: if (canvas) {
		if (pieChart) pieChart.destroy();
		pieChart = new Chart(canvas, {
			type: 'pie',
			data,
			options: {
				maintainAspectRatio: false
			}
		});
	}
</script>

<div class="h-full w-full">
	<canvas bind:this={canvas}></canvas>
</div>
