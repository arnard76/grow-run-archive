<script lang="ts">
	import Chart from 'chart.js/auto';
	import { resourcesList } from '$features/resource/store';
	import { growRuns } from '$features/grow-run/store';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

	const randomMinDate = new Date('2022-01-01T00:00:00.000Z').valueOf();
	const presentDate = Date.now().valueOf();

	$: data = {
		labels: $growRuns.map((growRun) => growRun.name),
		datasets: [
			{
				data: $growRuns.map((growRun) => ({
					x: growRun.duration.start ? new Date(growRun.duration.start).valueOf() : randomMinDate,
					y: growRun.calculateCostPer100g($resourcesList)
				})),

				backgroundColor: $growRuns.map((growRun) =>
					growRun.duration.start ? 'powderblue' : '#124356'
				)
			}
		]
	};

	let canvas: HTMLCanvasElement | undefined;
	let scatterChart: Chart<'scatter', { x: number; y: number }[], string> | undefined;

	$: if (canvas) {
		if (scatterChart) scatterChart.destroy();
		scatterChart = new Chart(canvas, {
			type: 'scatter',
			data,

			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						title: { display: true, text: 'Grow run start date' },
						type: 'time',
						min: randomMinDate,
						max: presentDate
					},
					y: {
						title: { display: true, text: 'Cost per 100g / NZD' },
						min: 0
					}
				}
			}
		});
	}
</script>

<h2>Grow Run Cost Archive</h2>
<p style="font-size: 12px;">
	*NOTE*: Can't include grow runs that didn't produce any output. (Where would they go? 😁)
</p>
<div>
	<canvas bind:this={canvas} class="h-[90vh]"></canvas>
</div>
