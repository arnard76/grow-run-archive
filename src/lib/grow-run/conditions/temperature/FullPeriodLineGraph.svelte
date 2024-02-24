<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$lib/grow-run';
	import type { TemperatureRecord } from './types';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';
	import { getData } from './openWeatherApiData';

	export let growRun: GrowRun;
	export let timezone: string;

	$: airTemps = growRun.conditions['air-temperature'] || [];
	$: waterTemps = growRun.conditions['water-temperature'] || [];
	$: min = growRun.duration.start
		? new Date(growRun.duration.start).valueOf()
		: Math.min(
				...[...airTemps, ...waterTemps].map((airTemp) => new Date(airTemp.dateTime).valueOf())
		  );
	$: max = growRun.duration.end
		? new Date(growRun.duration.end).valueOf()
		: Math.max(
				...[...airTemps, ...waterTemps].map((airTemp) => new Date(airTemp.dateTime).valueOf())
		  ) + 10000000; // for padding at the end of the graph

	let externalPublicTempData: {
		x: number;
		y: number;
	}[] = [];

	$: if (min && max) {
		getData(new Date(min), new Date(max)).then((res) => (externalPublicTempData = res));
	}

	function formatData(temps: TemperatureRecord[]) {
		return temps
			.map((record) => ({
				x: new Date(record.dateTime).valueOf(),
				y: record.temperature
			}))
			.sort(({ x: t1 }, { x: t2 }) => t1 - t2);
	}

	$: data = {
		datasets: [
			{
				label: 'air temperature',
				data: formatData(airTemps)
			},
			{
				label: 'water temperature',
				data: formatData(waterTemps)
			},
			{ label: 'public archive temperature data', data: externalPublicTempData }
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
				scales: {
					x: {
						title: { display: true, text: 'Datetime' },
						type: 'time',
						ticks: {
							callback: (label, index, ticks) => {
								return prettyFormatDate(new Date(label).toUTCString(), timezone)?.split(',')[0];
							}
						},

						min,

						max
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

<div>
	<canvas bind:this={canvas} style="max-width: 90vw;max-height:90vh;"></canvas>
</div>
