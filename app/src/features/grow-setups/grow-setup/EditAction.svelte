<script lang="ts">
	import { GrowSetup, growSetupActionNames } from '@grow-run-archive/definitions';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';
	import { growSetupsAPI } from '../store';
	import Inputs from './Inputs.svelte';

	export let growSetup: GrowSetup;
	export let closeModal: () => any;

	let nickname = growSetup.nickname;
	let link = growSetup.link;
	let version = growSetup.version;
</script>

<ActionTemplate
	actionName={growSetupActionNames.edit}
	onCancel={closeModal}
	onComplete={() => growSetupsAPI.updateFull({ id: growSetup.id, nickname, link, version })}
>
	<Inputs bind:version bind:nickname bind:link />
</ActionTemplate>
