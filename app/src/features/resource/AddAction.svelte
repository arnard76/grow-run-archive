<script lang="ts">
	import { resourcesList } from '$features/resource/store';
	import { Resource as ResourceClass } from '@grow-run-archive/definitions';

	import Inputs from '$features/resource/Inputs.svelte';
	import { resourceActionNames } from '@grow-run-archive/definitions';
	import ActionTemplate from '$lib/components/ActionTemplate.svelte';

	let newResource = {} as ResourceClass;

	function addResource() {
		let randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16);
		newResource.colour = randomColour;
		resourcesList.addResource(newResource);
		newResource = {} as ResourceClass;
	}

	export let closeModal: () => any;
</script>

<ActionTemplate actionName={resourceActionNames.add} onCancel={closeModal} onComplete={addResource}>
	<p>Here is an example:</p>
	<q>Volume: 10mL of nutrients for $10NZD</q>
	<Inputs bind:resourceToCreateOrUpdate={newResource} />
</ActionTemplate>
