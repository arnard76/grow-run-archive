<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$lib/grow-run';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';
	import {
		toVerbose,
		getConditionMetadata,
		formatMeasurementsData,
		getUnitsForConditions
	} from '../conditions';
	import type ConditionsMeasurements from '../conditions';

	export let growRun: GrowRun;
	export let conditionNames: (keyof ConditionsMeasurements)[];
	export let yAxisTitle: string = conditionNames[0];
	export let timezone: string;

	const showsMultipleDatasets = conditionNames.length > 1;
	const multipleAxes = getUnitsForConditions(conditionNames).length > 1;

	$: data = {
		datasets: conditionNames.map((conditionName) => ({
			label: conditionName,
			name: toVerbose(conditionName),
			data: formatMeasurementsData(growRun.conditions[conditionName] || {})
		}))
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
						title: {
							display: true,
							text: `${toVerbose(yAxisTitle)} / ${getUnitsForConditions(conditionNames)}`
						}
					}
				},
				plugins: {
					legend: { display: data.datasets.length > 1 },
					tooltip: {
						displayColors: data.datasets.length > 1,
						callbacks: {
							title: (tooltips) => {
								return prettyFormatDate(
									new Date((tooltips[0].raw as any).x as number).toUTCString(),
									timezone
								);
							},
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
		Full period graph can't show multiple axes yet. <br />The conditions ({conditionNames.toString()})
		have multiple units ({getUnitsForConditions(conditionNames)}) so have to be on multiple axes.
	</p>
{:else}
	<div class="h-96 w-full">
		<canvas bind:this={canvas}></canvas>
	</div>
{/if}
