<script lang="ts">
	import timezones from './timezones.json';
	const timezonesSorted = timezones.sort((tz1, tz2) => (tz1.offset < tz2.offset ? -1 : 1));

	export let timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<label class="flex flex-wrap gap-2">
	Timezone
	<select bind:value={timezone}>
		{#each timezonesSorted as timezone (timezone.text)}
			{#each timezone.utc as value}
				<option {value}>{timezone.offset} {value}</option>
			{/each}
		{/each}
	</select>
</label>
