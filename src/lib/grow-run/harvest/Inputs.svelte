<script lang="ts">
	export let numberOfLeaves: number, massOfLeaves: number;
</script>

<label>
	I harvested <input type="number" bind:value={numberOfLeaves} /> leaves
</label>

<label>
	that weighed

	<input type="number" bind:value={massOfLeaves} /> g
</label>

<style>
	input {
		width: 50px;
	}
</style>
