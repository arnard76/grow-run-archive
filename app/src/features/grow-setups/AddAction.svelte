<script lang="ts">
	import { growSetupActionNames, type GrowSetupType } from '@grow-run-archive/definitions';
	import ActionTemplate from '../../lib/components/ActionTemplate.svelte';
	import { growSetupsAPI, growSetups } from './store';

	export let closeModal: () => any;

	let nicknameInput = '';
	let linkInput = '';
	let previousVersion: GrowSetupType['version'] | null = $growSetups.length
		? $growSetups.sort().at(-1)!.version
		: null;

	$: version = calculateNextVersion(previousVersion);

	function calculateNextVersion(previousVersion: GrowSetupType['version'] | null) {
		if (!previousVersion) {
			if (!$growSetups.length) return '1';

			previousVersion = $growSetups.sort().at(-1)!.version;
		}

		const versionComponents = previousVersion.split('.');

		versionComponents[versionComponents.length - 1] = (
			parseInt(versionComponents.at(-1)!) + 1
		).toString();

		return versionComponents.join('.');
	}
</script>

<ActionTemplate
	actionName={growSetupActionNames.add}
	onCancel={closeModal}
	onComplete={() => growSetupsAPI.add({ nickname: nicknameInput, link: linkInput, version })}
>
	{#if previousVersion}
		<div class="horizontal-input-group">
			<label for="version-input">Previous version</label>
			<select bind:value={previousVersion}>
				{#each $growSetups as growSetup (growSetup.id)}
					<option value={growSetup.version}>{growSetup.name}</option>
				{/each}
				<option value="No previous version">None</option>
			</select>
		</div>
	{/if}
	<input type="text" placeholder="grow setup nickname" bind:value={nicknameInput} />
	<input type="text" placeholder="grow setup link" bind:value={linkInput} />
</ActionTemplate>
