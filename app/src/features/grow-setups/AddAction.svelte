<script lang="ts">
	import { growSetupActionNames, type GrowSetupType } from '@grow-run-archive/definitions';
	import ActionTemplate from '../../lib/components/ActionTemplate.svelte';
	import { growSetupsAPI, growSetups } from './store';
	import Inputs from './grow-setup/Inputs.svelte';

	export let closeModal: () => any;

	let nickname: string | undefined;
	let link: string | undefined;
	let version: string;

	function addAndReset() {
		growSetupsAPI.add({ nickname, link, version });
		link = undefined;
		nickname = undefined;
	}
</script>

<ActionTemplate
	actionName={growSetupActionNames.add}
	onCancel={closeModal}
	onComplete={addAndReset}
>
	<Inputs bind:version bind:nickname bind:link />
</ActionTemplate>
