<script lang="ts">
	import { GrowSetup, type GrowSetupType } from '@grow-run-archive/definitions';
	import { growSetups } from '../store';

	let previousVersion: GrowSetupType['version'] | null | undefined = null;
	export let nickname: string | undefined;
	export let link: string | undefined;
	export let version: GrowSetupType['version'];

	$: version = calculateNextVersion(previousVersion);
	$: if ($growSetups.find((gs) => gs.version === version)) {
		version = calculateNextVersion(previousVersion);
	}

	function calculateNextVersion(previousVersion: GrowSetupType['version'] | null | undefined) {
		if (previousVersion === undefined && version) return version;

		if (!previousVersion) {
			if (!$growSetups.length) return '1';

			previousVersion = GrowSetup.sort($growSetups).at(-1)!.version;
		} else {
			if (!previousVersion.includes('.')) previousVersion += '.0';
		}

		const versionComponents = previousVersion.split('.');

		versionComponents[versionComponents.length - 1] = (
			parseInt(versionComponents.at(-1)!) + 1
		).toString();

		return versionComponents.join('.');
	}
</script>

{#if $growSetups.length}
	<div class="horizontal-input-group">
		<label for="version-input">Related grow setup</label>
		<select bind:value={previousVersion}>
			{#each $growSetups as growSetup (growSetup.id)}
				<option value={growSetup.version}>{growSetup.name}</option>
			{/each}
			<option value={null}>None</option>
		</select>
	</div>
{/if}
<p>Version #{version}</p>
<label class="horizontal-input-group">
	Nickname <input type="text" placeholder="grow setup nickname" bind:value={nickname} />
</label>
<label class="horizontal-input-group">
	Link
	<input type="text" placeholder="grow setup link" bind:value={link} />
</label>
