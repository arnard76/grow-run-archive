<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type { TemperatureRecord } from './types';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';

	export let temperatureObj: TemperatureRecord;
	export let timezone: string;
	export let onUpdateTemperature = (newTemp: TemperatureRecord) => {};
</script>

<li>
	<EditTemplate onUpdate={() => onUpdateTemperature(temperatureObj)}>
		<p slot="display">
			{prettyFormatDate(temperatureObj.dateTime, timezone)}: {temperatureObj.temperature}°C
		</p>

		<Inputs
			slot="editing"
			bind:temperature={temperatureObj.temperature}
			bind:dateTime={temperatureObj.dateTime}
		/>
	</EditTemplate>
</li>
