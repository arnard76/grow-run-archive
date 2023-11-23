<script>
	export let data;

	$: ({ resourceName } = data);
</script>

{resourceName}
