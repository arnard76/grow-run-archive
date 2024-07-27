<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$lib/grow-run';
	import {
		getTimeValue,
		prettyFormatDate,
		timeValueToString
	} from '$lib/grow-run/details/duration/util';
	import {
		toVerbose,
		getConditionMetadata,
		type ConditionMeasurements,
		getUnitsForConditions
	} from '../conditions';
	import type ConditionsMeasurements from '../conditions';

	export let growRun: GrowRun;
	export let timezone: string;

	export let conditionNames: (keyof ConditionsMeasurements)[];
	export let yAxisTitle: string = conditionNames[0];
	const showsMultipleDatasets = conditionNames.length > 1;
	const multipleAxes = getUnitsForConditions(conditionNames).length > 1;

	function formatData(temps: ConditionMeasurements) {
		return Object.values(temps)
			.map((temperature) => ({
				x: getTimeValue(temperature.dateTime, timezone) as number,
				y: temperature.value,
				label: prettyFormatDate(temperature.dateTime, timezone)
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
							text: `${toVerbose(yAxisTitle)} / ${getUnitsForConditions(conditionNames)}`
						}
					}
				},
				plugins: {
					legend: { display: showsMultipleDatasets },
					tooltip: {
						displayColors: showsMultipleDatasets,
						callbacks: {
							title: (tooltips) => (tooltips[0].raw as { label: string }).label,
							label: (tooltipItem) =>
								`${showsMultipleDatasets ? tooltipItem.dataset.label + ': ' : ''}${
									tooltipItem.parsed.y
								} ${getConditionMetadata(tooltipItem.dataset.label).units}`
						}
					}
				}
			}
		});
	}
</script>

{#if multipleAxes}
	<p class="text-red-400">
		Time of day graph can't show multiple axes yet. <br />The conditions ({conditionNames.toString()})
		have multiple units ({getUnitsForConditions(conditionNames)}) so have to be on multiple axes.
	</p>
{:else}
	<div class="h-96 w-full">
		<canvas bind:this={canvas}></canvas>
	</div>
{/if}
