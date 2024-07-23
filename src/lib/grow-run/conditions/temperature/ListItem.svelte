<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import { type ConditionMeasurement } from '../conditions';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';

	export let temperatureObj: ConditionMeasurement;
	export let timezone: string;
	export let onUpdateTemperature = (newTemp: ConditionMeasurement) => {};
</script>

<li>
	<EditTemplate onUpdate={() => onUpdateTemperature(temperatureObj)}>
		<p slot="display">
			{prettyFormatDate(temperatureObj.dateTime, timezone)}: {temperatureObj.value}°C
		</p>

		<Inputs
			slot="editing"
			bind:temperature={temperatureObj.value}
			bind:dateTime={temperatureObj.dateTime}
		/>
	</EditTemplate>
</li>
