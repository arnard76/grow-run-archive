<div class="group">
	<slot name="text" />

	<div
		class="hidden flex-col p-4 rounded-md absolute gap-1 group-hover:flex h-0 group-hover:h-fit overflow-hidden transition-[height] duration-1000 ease-out bg-gray-800 bg-opacity-65"
	>
		<slot />
	</div>
</div>
