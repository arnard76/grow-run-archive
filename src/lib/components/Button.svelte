<script>
	export let title = 'button';
</script>

<button on:click {title}>
	<slot />
</button>

<style>
	button {
		outline: none;
		border: none;
		background-color: rgb(199, 230, 173);
		cursor: pointer;
		padding: 5px;
		border-radius: 8px;
	}
</style>
