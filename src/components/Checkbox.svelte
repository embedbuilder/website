<script lang="ts">
	export let label: string;
	export let onUpdate: (newValue: boolean) => void;

	export let value = false;
</script>

<div class="flex flex-row items-center gap-x-3">
	<div
		on:click={() => {
			value = !value;
			onUpdate(value);
		}}
		on:keydown={() => {
			value = !value;
			onUpdate(value);
		}}
		class="cursor-pointer checkbox{value ? ' checked ' : ' '}flex items-center justify-center"
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
	<span
		on:click={() => {
			value = !value;
			onUpdate(value);
		}}
		on:keydown={() => {
			value = !value;
			onUpdate(value);
		}}
		class="cursor-pointer text-[#dcddde] -mt-1 select-none"
		style="font-size: 14px;">{label ?? ''}</span
	>
</div>

<style>
	.checkbox {
		width: 24px;
		height: 24px;
		border: 1px solid rgb(114, 118, 125);
		border-radius: 6px;
	}
	.checkbox.checked {
		border: 1px solid rgb(121, 131, 245);
		background: #5865f2;
	}
</style>
