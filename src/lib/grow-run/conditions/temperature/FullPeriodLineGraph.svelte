<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$lib/grow-run';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';
	import { formatMeasurementsData } from '../conditions';

	export let growRun: GrowRun;
	export let timezone: string;

	$: airTemps = growRun.conditions['air-temperature'] || {};
	$: waterTemps = growRun.conditions['water-temperature'] || {};

	$: data = {
		datasets: [
			{
				label: 'air temperature',
				data: formatMeasurementsData(airTemps)
			},
			{
				label: 'water temperature',
				data: formatMeasurementsData(waterTemps)
			}
		]
	};

	let canvas: HTMLCanvasElement | undefined;
	let lineChart: Chart<'line', { x: number; y: number }[], string> | undefined;

	$: if (canvas) {
		if (lineChart) lineChart.destroy();
		lineChart = new Chart(canvas, {
			type: 'line',
			data,

			options: {
				maintainAspectRatio: false,
				scales: {
					x: {
						title: { display: true, text: 'Datetime' },
						type: 'time',
						ticks: {
							callback: (label, index, ticks) => {
								return prettyFormatDate(new Date(label).toUTCString(), timezone)?.split(',')[0];
							}
						},

						suggestedMin: growRun.duration.start,
						suggestedMax: growRun.duration.end ? growRun.duration.end + 10000000 : undefined // for padding at the end of the graph
					},
					y: {
						title: { display: true, text: 'Temperature / °C' }
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							title: (tooltips) => {
								return prettyFormatDate(
									new Date((tooltips[0].raw as any).x as number).toUTCString(),
									timezone
								);
							}
						}
					}
				}
			}
		});
	}
</script>

<h6>Temperature readings throughout grow run</h6>

<div class="h-96 max-w-[40rem]">
	<canvas bind:this={canvas}></canvas>
</div>
