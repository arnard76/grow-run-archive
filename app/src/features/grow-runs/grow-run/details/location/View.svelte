<script lang="ts">
	import type GrowRun from '$features/grow-runs/grow-run';
	import Icon from '@iconify/svelte';

	export let growRun: GrowRun;
</script>

<p>
	{#if growRun.location}
		<a
			href="https://www.google.com/maps/place/{growRun.location.latitude},{growRun.location
				.longitude}"
			target="_blank"
			class="no-underline"
		>
			<Icon icon="tabler:map-pin" class="mb-[-4px]" />
			<span>
				{growRun.location.address.city}, {growRun.location.address.country}
			</span>
		</a>
	{:else}
		No location
	{/if}
</p>
