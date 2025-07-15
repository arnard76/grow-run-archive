<script lang="ts">
	import { growSetupActionNames, type GrowSetupType } from '@grow-run-archive/definitions';
	import ActionTemplate from '../../lib/components/ActionTemplate.svelte';
	import { growSetupsAPI, growSetups } from './store';

	export let closeModal: () => any;

	let nicknameInput: string | undefined;
	let linkInput: string | undefined;
	let previousVersion: GrowSetupType['version'] | null = null;

	$: version = calculateNextVersion(previousVersion);

	function calculateNextVersion(previousVersion: GrowSetupType['version'] | null) {
		if (!previousVersion) {
			if (!$growSetups.length) return '1';

			previousVersion = $growSetups
				.sort((a, b) => a.version.localeCompare(b.version))
				.at(-1)!.version;
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

<ActionTemplate
	actionName={growSetupActionNames.add}
	onCancel={closeModal}
	onComplete={() => growSetupsAPI.add({ nickname: nicknameInput, link: linkInput, version })}
>
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
		Nickname <input type="text" placeholder="grow setup nickname" bind:value={nicknameInput} />
	</label>
	<label class="horizontal-input-group">
		Link
		<input type="text" placeholder="grow setup link" bind:value={linkInput} />
	</label>
</ActionTemplate>
