<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type GrowRun from '$features/grow-runs/grow-run';
	import {
		getTimeValue,
		prettyFormatDate,
		timeValueToString
	} from '$features/grow-runs/grow-run/details/duration/util';
	import { getUnitsForConditions } from '../conditions';
	import {
		type ConditionsMeasurements,
		type ConditionMeasurement,
		verboseConditionName,
		getConditionMetadata
	} from '@grow-run-archive/definitions';

	export let growRun: GrowRun;
	export let timezone: string;

	export let conditionNames: (keyof ConditionsMeasurements)[];
	export let yAxisTitle: string = conditionNames[0];
	const showsMultipleDatasets = conditionNames.length > 1;
	const multipleAxes = getUnitsForConditions(conditionNames).length > 1;

	function formatMeasurementToDatapoint(measurement: ConditionMeasurement) {
		return {
			x: getTimeValue(measurement.dateTime, timezone) as number,
			y: measurement.value,
			label: prettyFormatDate(measurement.dateTime, timezone)
		};
	}

	function formatDatasets() {
		function getDateOnly(dateString: string) {
			const d = new Date(new Date(dateString).toLocaleString('en-US', { timeZone: timezone }));
			return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toString();
		}

		function differentDays(dateString: string, dateString2: string) {
			return getDateOnly(dateString) != getDateOnly(dateString2);
		}

		let datasets = [];

		for (let conditionName of conditionNames) {
			const sortedMeasurements = Object.values(growRun.conditions[conditionName]).sort(
				(a, b) => new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf()
			);

			let dataset: any;
			for (let index = 0; index < sortedMeasurements.length; index++) {
				let measurement = sortedMeasurements[index];
				if (
					index === 0 ||
					differentDays(measurement.dateTime, sortedMeasurements[index - 1].dateTime)
				) {
					// make a new dataset pls
					dataset && datasets.push(dataset);
					dataset = {
						data: [formatMeasurementToDatapoint(measurement)],
						label: conditionName,
						name:
							verboseConditionName(conditionName) +
							' ' +
							new Date(getDateOnly(measurement.dateTime)).toLocaleDateString('en-NZ', {
								timeZone: timezone
							})
					};
				} else {
					dataset.data.push(formatMeasurementToDatapoint(measurement));
				}

				if (index === sortedMeasurements.length - 1) datasets.push(dataset);
			}
		}

		return datasets;
	}

	$: data = {
		datasets: formatDatasets()
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
							text: `${verboseConditionName(yAxisTitle)} / ${getUnitsForConditions(conditionNames)}`
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
