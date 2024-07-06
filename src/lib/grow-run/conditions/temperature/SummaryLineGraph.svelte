<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$lib/grow-run';
	import { getTimeValue, timeValueToString } from '$lib/grow-run/details/duration/util';
	import type { TemperatureRecord } from './types';

	export let growRun: GrowRun;
	export let timezone: string;

	$: airTemps = growRun.conditions['air-temperature'] || [];
	$: waterTemps = growRun.conditions['water-temperature'] || [];

	function formatTemps(temps: TemperatureRecord[]) {
		return temps
			.map((temperature) => ({
				x: getTimeValue(temperature.dateTime, timezone) as number,
				y: temperature.temperature
			}))
			.sort((a, b) => (a.x > b.x ? -1 : 1));
	}

	$: data = {
		datasets: timezone
			? [
					{
						label: 'air temperature',
						data: formatTemps(airTemps)
					},
					{
						label: 'water temperature',
						data: formatTemps(waterTemps)
					}
			  ]
			: []
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
						title: { display: true, text: 'Time during day' },
						type: 'time',
						min: 0,
						max: 24 * 3600 * 1000,
						ticks: {
							callback: (label, index, ticks) => {
								return timeValueToString(label as number);
							}
						}
					},
					y: {
						title: { display: true, text: 'Temperature / °C' },
						min: 10,
						max: 25
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							title: (tooltips) => timeValueToString((tooltips[0].raw as any).x as number)
						}
					}
				}
			}
		});
	}
</script>

<h6>Temperature at time of day</h6>

<div class="h-96 w-[40rem]">
	<canvas bind:this={canvas} style="max-width: 90vw;max-height:90vh;"></canvas>
</div>
