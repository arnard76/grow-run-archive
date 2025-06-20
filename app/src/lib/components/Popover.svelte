<script>
	// @ts-nocheck

	export let show = false;
</script>

<dialog
	class="m-0 top-full left-full -translate-x-full border-none overflow-visible rounded-md bg-black bg-opacity-25 p-2"
	open={show}
	on:close={() => (show = false)}
	closedby="any"
>
	<slot />
</dialog>
