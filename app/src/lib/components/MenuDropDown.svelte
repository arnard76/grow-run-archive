<script lang="ts">
	let dropdownmenu: HTMLDivElement | undefined;
	let rightHandSide = false;

	// if the sub menu is overflowing the page, move it across
	$: if (dropdownmenu && dropdownmenu.getBoundingClientRect().right + 100 > window.innerWidth) {
		rightHandSide = true;
	}
</script>

<div class="group relative" bind:this={dropdownmenu}>
	<slot name="text" />

	<div
		class="hidden -z-10 flex-col p-4 pt-[3rem] w-max rounded-md absolute gap-1 group-hover:flex items-start h-0 top-0 group-hover:h-fit overflow-hidden transition-[height] duration-1000 ease-out bg-gray-800 bg-opacity-65
		{rightHandSide ? 'right-0 items-end' : ''}"
	>
		<slot />
	</div>
</div>
