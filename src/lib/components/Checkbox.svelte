<script lang="ts">
	export let label: string;

	export let value = false;
</script>

<div
	on:click={() => (value = !value)}
	on:keydown={() => (value = !value)}
	class="flex flex-row items-center gap-x-3"
>
	<div
		class="cursor-pointer checkbox flex items-center justify-center w-6 h-6 border border-zinc-500 rounded-md"
		aria-checked={value}
	>
		{#if value}
			<svg aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24"
				><path
					fill="#FFFFFF"
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"
				/></svg
			>
		{/if}
	</div>
	<span class="cursor-pointer text-[#dcddde] -mt-1 select-none" style="font-size: 14px;"
		>{label ?? ''}</span
	>
</div>

<style>
	.checkbox[aria-checked='true'] {
		border: 1px solid rgb(121, 131, 245);
		background: #5865f2;
	}
</style>
