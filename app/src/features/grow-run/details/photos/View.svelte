<script lang="ts">
	import GrowRun from '../..';

	export let growRun: GrowRun;

	import { downloadGrowSetupPhotos } from '$features/grow-run/details/photos/photoStorage';

	let growSetupPhotos: any[] = [];
	downloadGrowSetupPhotos(growRun).then((res) => (growSetupPhotos = res));
</script>

<section>
	{#if growSetupPhotos.length}
		<div class="grow-setup-photos">
			{#each growSetupPhotos as photo, i}
				<img
					src={URL.createObjectURL(photo)}
					alt={`photo #${i} for grow run with label: '${growRun.name}'`}
				/>
			{/each}
		</div>
	{/if}
</section>

<style>
	.grow-setup-photos {
		display: flex;
		width: 100%;
		overflow-x: auto;
		align-items: center;
		gap: 5px;
		padding: 5px;
	}

	.grow-setup-photos img {
		max-height: 200px;
	}
</style>
