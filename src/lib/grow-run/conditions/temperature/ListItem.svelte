<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type { Temperature } from './types';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from '$lib/grow-run/details/duration/util';

	export let temperatureObj: Temperature;
	export let onUpdateTemperature = (newTemp: Temperature) => {};
</script>

<li>
	<EditTemplate onClick={() => onUpdateTemperature(temperatureObj)}>
		<p slot="display" style="display: inline-block;">
			{prettyFormatDate(temperatureObj.dateTime)}: {temperatureObj.temperature}°C
		</p>

		<Inputs
			slot="editing"
			bind:temperature={temperatureObj.temperature}
			bind:dateTime={temperatureObj.dateTime}
		/>
	</EditTemplate>
</li>
