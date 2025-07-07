<script lang="ts">
	import timezones from 'timezones-list';

	export let timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<label class="flex flex-wrap gap-2 items-center text-wrap overflow-hidden break-words">
	Timezone
	<select bind:value={timezone}>
		{#each timezones as timezone (timezone)}
			<option value={timezone.tzCode}>{timezone.name}</option>
		{/each}
	</select>
</label>
