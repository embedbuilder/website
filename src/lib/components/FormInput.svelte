<script lang="ts">
	import { generateUid } from '../functions/Utility';

	export let label: string;
	export let maxLength: number | undefined;
	export let height = 72;

	export let value: string | undefined;

	const formFieldUid = generateUid();
</script>

<div>
	<label for={formFieldUid} class="uppercase text-[#B9BBBE] font-medium text-[12px]">
		{label}
	</label><br />
	<div class="relative">
		<textarea
			maxlength={maxLength && maxLength > 0 ? maxLength : -1}
			style="height: {height}px"
			class="resize-none text-[#dcddde] outline-none mt-1.5 w-full bg-[#202225] rounded-[3px] py-[10px] px-3"
			bind:value
			id={formFieldUid}
		/>
		{#if maxLength && maxLength > 0}
			<span
				class="absolute maxlength right-4 bottom-3 text-[12px] text-zinc-400 cursor-pointer select-none"
				>{maxLength - (value?.length ?? 0)}</span
			>
		{/if}
	</div>
</div>

<style>
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
		font-family: 'Consolas', monospace;
	}
</style>
