<script lang="ts">
	import { generateUid } from '../lib/functions/Misc';

	export let label: string;
	export let onUpdate: (newValue: string) => void;
	export let maxLength: number | undefined;
	export let height = 72;

	export let value = '';

	const formFieldUid = generateUid();
	value = value?.concat();
</script>

<div>
	<label for={formFieldUid} class="uppercase text-[#B9BBBE] font-medium">
		{label}
	</label><br />
	<div class="relative">
		<textarea
			maxlength={maxLength && maxLength > 0 ? maxLength : -1}
			style="height: {height}px"
			class="resize-none text-[#dcddde] outline-none mt-1.5 w-full bg-[#202225]"
			bind:value
			id={formFieldUid}
			on:input={() => {
				onUpdate(value);
			}}
		/>
		{#if maxLength && maxLength > 0}
			<span class="absolute maxlength">{maxLength - (value?.length ?? 0)}</span>
		{/if}
	</div>
</div>

<style>
	label {
		font-size: 12px;
	}

	textarea {
		border-radius: 3px;
		padding: 10px 40px 10px 10px;
	}

	textarea::-webkit-scrollbar {
		width: 8px;
		border-radius: 4px;
	}

	textarea::-webkit-scrollbar-track {
		background: #2e3338;
		border-radius: 4px;
	}

	textarea::-webkit-scrollbar-thumb {
		background: #202225;
		border-radius: 4px;
	}

	.maxlength {
		right: 14px;
		bottom: 12px;
		font-size: 12px;
		color: rgb(163, 166, 170);
		font-family: 'Consolas', monospace;
		user-select: none;
		cursor: pointer;
	}
</style>
