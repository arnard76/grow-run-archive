<!-- TODO: export should also include the photos -->
<script lang="ts">
	import { growRuns } from '$features/grow-run/store';
	import { resourcesList } from '$features/resource/store';
	import { session } from '$features/user/session';
	import dayjs from '@grow-run-archive/dayjs';
	import { userActionNames } from '@grow-run-archive/definitions';
	import { JsonView } from '@zerodevx/svelte-json-view';

	export let closeModal: () => any;
	$: userData = {
		growRuns: $growRuns,
		resources: $resourcesList
	};

	function downloadUserData() {
		const userDataString =
			'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userData));
		const downloadEl = document.createElement('a');
		downloadEl.setAttribute('href', userDataString);
		downloadEl.setAttribute('download', `${$session.user?.uid}_${dayjs().toISOString()}.json`);
		downloadEl.click();
		closeModal();
	}
</script>

<h3 class="m-0 mb-4">{userActionNames.export}</h3>

<div class="my-4">
	<JsonView json={userData} />
</div>
<button on:click={downloadUserData}>Download</button>
