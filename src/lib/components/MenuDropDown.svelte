<script>
	let expand = false;
</script>

<div role="group" on:mouseenter={() => (expand = true)} on:mouseleave={() => (expand = false)}>
	<slot name="text" />

	{#if expand}
		<div style="display: flex;flex-direction:column;margin-left: 10px;margin-top: 5px;">
			<slot />
		</div>
	{/if}
</div>
