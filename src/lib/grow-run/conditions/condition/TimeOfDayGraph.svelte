<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$lib/grow-run';
	import { getTimeValue, timeValueToString } from '$lib/grow-run/details/duration/util';
	import { toVerbose, getConditionMetadata, type ConditionMeasurements } from '../conditions';
	import type ConditionsMeasurements from '../conditions';

	export let growRun: GrowRun;
	export let timezone: string;

	export let conditionNames: (keyof ConditionsMeasurements)[];
	export let yAxisTitle: string = conditionNames[0];

	function formatData(temps: ConditionMeasurements) {
		return Object.values(temps)
			.map((temperature) => ({
				x: getTimeValue(temperature.dateTime, timezone) as number,
				y: temperature.value
			}))
			.sort(({ x: t1 }, { x: t2 }) => t1 - t2);
	}

	$: data = {
		datasets: timezone
			? conditionNames.map((conditionName) => ({
					label: conditionName,
					name: toVerbose(conditionName),
					data: formatData(growRun.conditions[conditionName] || {})
			  }))
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
						title: { display: true, text: 'Time of day' },
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
						title: {
							display: true,
							text: `${toVerbose(yAxisTitle)} / ${conditionNames.map(
								(name) => getConditionMetadata(name).units
							)}`
						}
					}
				},
				plugins: {
					legend: { display: data.datasets.length > 1 },
					tooltip: {
						displayColors: data.datasets.length > 1,
						callbacks: {
							title: (tooltips) => timeValueToString((tooltips[0].raw as any).x as number),
							label: (tooltipItem) =>
								tooltipItem.parsed.y + getConditionMetadata(tooltipItem.dataset.label).units
						}
					}
				}
			}
		});
	}
</script>

<div class="h-96 w-full">
	<canvas bind:this={canvas}></canvas>
</div>
