<script lang="ts">
	import '$lib/css/DiscordComponents/Buttons.css';
	import FormInput from './FormInput.svelte';

	interface FormInputField {
		label: string;
		maxLength?: number;
	}

	export let label = 'Label';
	export let formInputFields: (FormInputField & { value?: string })[] = [];

	enum ButtonType {
		Primary = 'btn-primary',
		Secondary = 'btn-secondary',
		Success = 'btn-success',
		Danger = 'btn-danger'
	}

	export let onSubmit: (values: { label: string; value: string }[]) => void;
	export let onClose: () => void;
	export let submitButtonText = 'Submit';
	export let submitButtonType: ButtonType = ButtonType.Primary;

	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') onClose();
	});
</script>

<svelte:head>
	<style>
		body {
			overflow: hidden;
		}
	</style>
</svelte:head>
<div
	on:click={onClose}
	on:keydown={onClose}
	class="fixed top-0 left-0 bg-black opacity-70 z-30"
	style="width: 100vw; height: 100vh;"
/>
<form
	on:submit|preventDefault={() =>
		onSubmit(formInputFields.map((r) => ({ label: r.label, value: r.value ?? '' })))}
	class="modal z-40 bg-[#36393f] fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
>
	<div class="modal-header flex flex-row items-center gap-x-2">
		<img src="/favicon.png" alt="Logo" class="w-6 -mb-0.5" />
		<h3 class="text-white">{label}</h3>
		<button
			on:click={onClose}
			class="ml-auto text-gray-500 cursor-pointer hover:text-gray-300 duration-200"
		>
			<svg
				class="closeIcon-11LhXr"
				aria-hidden="true"
				role="img"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
				/></svg
			>
		</button>
	</div>
	<div class="modal-fields flex flex-col gap-y-4">
		{#each formInputFields as field}
			<FormInput
				label={field.label}
				maxLength={field.maxLength}
				bind:value={field.value}
				height={44}
				onUpdate={(value) => (field.value = value)}
			/>
		{/each}
	</div>
	<div class="modal-control bg-[#2f3136]">
		<div class="flex flex-row justify-end gap-x-2">
			<button class="discord-btn hover:underline text-[#f4f4f5]" on:click={onClose}>Cancel</button>
			<button class="discord-btn btn-primary">Submit</button>
		</div>
	</div>
</form>

<style>
	h3 {
		font-size: 24px;
	}
	.modal {
		width: 440px;
		border-radius: 4px;
	}
	.modal-header,
	.modal-control {
		padding: 16px;
	}
	.modal-fields {
		padding: 0 16px 16px 16px;
	}
</style>
