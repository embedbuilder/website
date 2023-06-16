<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import '$lib/css/DiscordComponents/Buttons.css';
	import EmbedExporter from '$lib/functions/EmbedExporter.js';
	import { generateUid } from '$lib/functions/Misc.js';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Checkbox from '../components/Checkbox.svelte';
	import DiscordBanner from '../components/DiscordBanner.svelte';
	import Embed from '../components/Embed.svelte';
	import FormInput from '../components/FormInput.svelte';
	import Modal from '../components/Modal.svelte';
	import currentWebhook from '../lib/stores/WebhookData';
	import currentEmbed from '../lib/stores/currentEmbed';
	import settings from '../lib/stores/settings';
	import type { AppEmbed } from '../lib/types';

	let exportedCode = '';

	let WEBHOOK_URL_REGEX =
		/^https:\/\/((canary|ptb)\.)?discord.com\/api(\/v\d+)?\/webhooks\/(\d+)\/([\w-]+)$/;

	const utf8ToB64 = (s: string) => btoa(encodeURIComponent(s));
	const b64ToUtf8 = (s: string) => decodeURIComponent(atob(s));

	currentEmbed.subscribe((embed) => {
		exportedCode = (new EmbedExporter(embed) as any)[$settings?.exportFramework as any]();
	});

	settings.subscribe((settings) => {
		exportedCode = new EmbedExporter($currentEmbed as AppEmbed)[settings.exportFramework]();
	});

	if (browser) {
		try {
			const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
			if (searchParams.has('e')) {
				const embed = JSON.parse(b64ToUtf8(searchParams.get('e') as string));
				currentEmbed.set(embed);
			}
		} catch (e) {
			alert('Invalid embed code providen in URL');
			goto('/');
		}
	}

	let showSaveInBrowserModal = false;
	$: if (browser && currentEmbed) {
		const url = `${location.protocol}//${location.host}/?e=${utf8ToB64(
			JSON.stringify($currentEmbed)
		)}`;
		window.history.replaceState({}, '', url);
	}
</script>

<div class="flex flex-col pb-20">
	<div class="grid grid-cols-1 lg:grid-cols-2 pt-5 gap-x-8 gap-y-12 pb-10">
		<div class=" animate__animated animate__backInLeft">
			<div class="pl-5 pr-5 flex flex-col gap-y-8">
				<h1 class="-mb-4 text-white text-2xl font-bold">EmbedBuilder for Discord</h1>
				<div class="-mb-2">
					<ul class="text-gray-400">
						<li>You can edit most of the items inline by double clicking the preview.</li>
						<li>Edit the color by clicking on the color bar in the preview.</li>
						<li>Use variables like <code>{'{myVariable}'}</code> (only for code output)</li>
					</ul>
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">Author</p>
					<FormInput
						maxLength={256}
						height={44}
						value={$currentEmbed?.authorName}
						onUpdate={(n) => ($currentEmbed.authorName = n)}
						label="Author Name"
					/>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10">
						<FormInput
							maxLength={0}
							height={44}
							value={$currentEmbed?.authorUrl}
							onUpdate={(n) => ($currentEmbed.authorUrl = n)}
							label="Author Url"
						/>
						<FormInput
							maxLength={0}
							height={44}
							value={$currentEmbed?.authorImageUrl}
							onUpdate={(n) => ($currentEmbed.authorImageUrl = n)}
							label="Author Image Url"
						/>
					</div>
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">General</p>
					<FormInput
						maxLength={256}
						value={$currentEmbed?.title}
						label="Title"
						onUpdate={(n) => ($currentEmbed.title = n)}
					/>
					<FormInput
						maxLength={256}
						value={$currentEmbed?.titleUrl}
						height={44}
						label="Title Url"
						onUpdate={(n) => ($currentEmbed.titleUrl = n)}
					/>
					<FormInput
						maxLength={4096}
						value={$currentEmbed?.description}
						label="Description"
						onUpdate={(n) => ($currentEmbed.description = n)}
					/>
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">Images</p>
					<FormInput
						maxLength={0}
						height={44}
						value={$currentEmbed?.thumbnailImageUrl}
						onUpdate={(n) => ($currentEmbed.thumbnailImageUrl = n)}
						label="Thumbnail Image Url"
					/>
					<FormInput
						maxLength={0}
						height={44}
						value={$currentEmbed?.imageUrl}
						onUpdate={(n) => ($currentEmbed.imageUrl = n)}
						label="Image Url"
					/>
				</div>
				<div class="flex flex-col gap-y-6">
					<p class="uppercase text-[#B9BBBE] font-medium">Fields</p>
					{#if ($currentEmbed?.fields?.length ?? 0) > 0}
						{#each $currentEmbed?.fields ?? [] as field}
							<div class="flex flex-row items-center w-full relative">
								<button
									title="Delete this field"
									class="-mb-10 hidden xl:block mr-5 hover:opacity-70 duration-200 absolute xl:relative right-0 bottom-4"
									on:click={() =>
										($currentEmbed.fields = ($currentEmbed.fields ?? []).filter(
											(f) => f.id !== field.id
										))}
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 46 48"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M30.5 5.48065V0.483154H15.5V5.48065H0.5V10.4807H45.5V5.48065H30.5Z"
											fill="#E93848"
										/>
										<path
											d="M5.5 12.9807V42.9807C5.5 45.7357 7.7425 47.9807 10.5 47.9807H35.5C38.2575 47.9807 40.5 45.7357 40.5 42.9807V12.9807H5.5ZM20.5 37.9832H15.5V22.9832H20.5V37.9832ZM30.5 37.9832H25.5V22.9832H30.5V37.9832Z"
											fill="#E93848"
										/>
									</svg>
								</button>
								<div
									class="w-full grid grid-cols-1 mb-5 md:mb-0 xl:grid-cols-10 gap-x-10 relative -mt-2"
								>
									<div class="xl:col-span-4">
										<FormInput
											height={44}
											maxLength={256}
											label="Name"
											value={field.name}
											onUpdate={(n) => (field.name = n)}
										/>
									</div>
									<div class="xl:col-span-4">
										<FormInput
											height={44}
											maxLength={1024}
											label="Value"
											value={field.value}
											onUpdate={(n) => (field.value = n)}
										/>
									</div>
									<div class="flex flex-row items-center h-full mt-2.5 xl:col-span-2">
										<Checkbox
											label="Inline"
											value={field.inline}
											onUpdate={(n) => (field.inline = n)}
										/>

										<button
											title="Delete this field"
											class="ml-auto xl:hidden"
											on:click={() =>
												($currentEmbed.fields = ($currentEmbed.fields ?? []).filter(
													(f) => f.id !== field.id
												))}
										>
											<svg
												width="18"
												height="18"
												viewBox="0 0 46 48"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M30.5 5.48065V0.483154H15.5V5.48065H0.5V10.4807H45.5V5.48065H30.5Z"
													fill="#E93848"
												/>
												<path
													d="M5.5 12.9807V42.9807C5.5 45.7357 7.7425 47.9807 10.5 47.9807H35.5C38.2575 47.9807 40.5 45.7357 40.5 42.9807V12.9807H5.5ZM20.5 37.9832H15.5V22.9832H20.5V37.9832ZM30.5 37.9832H25.5V22.9832H30.5V37.9832Z"
													fill="#E93848"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<p class="text-gray-400 text-sm -mt-2">You did not set up any fields yet.</p>
					{/if}
					<div>
						<button
							class="discord-btn btn-primary"
							disabled={($currentEmbed?.fields?.length ?? 0) > 25}
							on:click={() =>
								($currentEmbed.fields = ($currentEmbed.fields ?? []).concat({
									id: generateUid(),
									name: '',
									value: '',
									inline: false
								}))}>Add Field</button
						>
					</div>
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">Footer</p>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10">
						<FormInput
							maxLength={2048}
							height={44}
							value={$currentEmbed?.footerText}
							onUpdate={(n) => ($currentEmbed.footerText = n)}
							label="Footer Text"
						/>
						<FormInput
							maxLength={0}
							height={44}
							value={$currentEmbed?.footerIconUrl}
							onUpdate={(n) => ($currentEmbed.footerIconUrl = n)}
							label="Footer Icon Url"
						/>
					</div>
					<div>
						<label for="ts" class="uppercase text-[#B9BBBE] font-medium text-xs">
							Timestamp
						</label><br />
						<input
							type="datetime-local"
							id="ts"
							value={$currentEmbed?.timestamp}
							on:change={(e) => {
								// @ts-ignore
								$currentEmbed.timestamp = e.target?.value;
							}}
							class="w-full h-[45px] rounded-md bg-[#202225] border border-solid border-[#35353b] text-gray-300 px-3 outline-none"
						/>
					</div>
				</div>
				<div>
					<span class="label uppercase text-[#B9BBBE] font-medium">Export as...</span><br />
					<div>
						<div
							class="code-btn-group grid grid-cols-4 bg-[#202225] border-b-[#35353b] text-gray-300 font-bold"
							style="border-bottom-width: 1px"
						>
							<button
								on:click={() => ($settings.exportFramework = 'discordJs')}
								class="duration-200 py-3 {$settings.exportFramework === 'discordJs'
									? 'bg-gray-700'
									: ''}">discord.js</button
							>
							<button
								on:click={() => ($settings.exportFramework = 'jda')}
								class="duration-200 py-3 {$settings.exportFramework === 'jda' ? 'bg-gray-700' : ''}"
								>JDA</button
							>
							<button
								on:click={() => ($settings.exportFramework = 'discordPy')}
								class="duration-200 py-3 {$settings.exportFramework === 'discordPy'
									? 'bg-gray-700'
									: ''}">discord.py</button
							>
							<button
								on:click={() => ($settings.exportFramework = 'json')}
								class="duration-200 py-3 {$settings.exportFramework === 'json'
									? 'bg-gray-700'
									: ''}">JSON</button
							>
						</div>
						<div class="w-full relative">
							<button
								on:click={() =>
									navigator.clipboard.writeText(
										exportedCode
											.replaceAll('<br />', '\n')
											.replace(/\&\#62\;/g, '>')
											.replace(/\&\#60\;/g, '<')
									)}
								class="cursor-pointer hover:opacity-60 duration-200 absolute bottom-5 right-3 w-10 h-10 flex items-center justify-center border-gray-400 rounded-md border-solid"
								style="border-width: 1px;"
								title="Copy to Clipboard"
							>
								<Fa icon={faCopy} class="text-gray-400" />
							</button>
							<div
								style="white-space: pre; border-radius: 0 0 3px 3px; font-family: 'Consolas', monospace;"
								class="codebox p-4 pb-16 overflow-y-none overflow-x-scroll w-full text-white outline-none resize-none bg-[#202225]"
							>
								{@html exportedCode}
							</div>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-4 gap-y-4 2xl:gap-y-6">
					<button
						class="discord-btn btn-danger w-full md:w-auto"
						on:click={() => currentEmbed.set({})}>Clear Embed</button
					>
					<!--<button
						on:click={() => (showSaveInBrowserModal = true)}
						class="discord-btn btn-success w-full md:w-auto">Save in Browser</button
					>
					<button class="discord-btn btn-secondary w-full md:w-auto"
						>Load from previously saved</button
					> -->
					<button
						on:click={async () => {
							const response = await fetch('/api/v1/shorturl', {
								method: 'POST',
								body: JSON.stringify(new EmbedExporter($currentEmbed).toJSON())
							});
							const { code, error } = await response.json();
							if (!code) return alert(error);
							navigator.clipboard.writeText(`${location.protocol}//${location.host}/s/${code}`);
							if (typeof window !== 'undefined') window.history.replaceState({}, '', `/s/${code}`);
						}}
						class="discord-btn btn-secondary w-full md:w-auto 2xl:ml-5">Copy Link to Embed</button
					>
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">Send to Discord Webhook</p>
					<div>
						<label for="webhookurl" class="uppercase text-[#B9BBBE] font-medium text-xs">
							Webhook URL
						</label><br />
						<input
							id="webhookurl"
							style="height: 44px"
							class="resize-none text-[#dcddde] outline-none p-3 rounded mt-1.5 w-full bg-[#202225]"
							value={$currentWebhook?.url ?? ''}
							on:change={(e) => {
								// @ts-ignore
								$currentWebhook.url = e.target?.value;
							}}
						/>
					</div>
					<div class="mt-3">
						<FormInput
							maxLength={4096}
							height={44}
							value={$currentWebhook?.content}
							onUpdate={(n) => ($currentWebhook.content = n)}
							label="Message Content"
						/>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 mt-3">
						<FormInput
							maxLength={32}
							height={44}
							value={$currentWebhook?.username}
							onUpdate={(n) => ($currentWebhook.username = n)}
							label="Author Name"
						/>
						<FormInput
							maxLength={0}
							height={44}
							value={$currentWebhook?.avatarUrl}
							onUpdate={(n) => ($currentWebhook.avatarUrl = n)}
							label="Author Avatar Url"
						/>
					</div>
					<button
						on:click={async () => {
							if (!$currentWebhook.url) return alert('Please enter a webhook URL');
							const result = await fetch($currentWebhook.url, {
								method: 'POST',
								body: JSON.stringify({
									embeds: [new EmbedExporter($currentEmbed).toDiscordJSON()],
									username:
										($currentWebhook?.username?.length ?? 0) > 0
											? $currentWebhook?.username
											: undefined,
									avatar_url:
										($currentWebhook?.avatarUrl?.length ?? 0) > 0
											? $currentWebhook?.avatarUrl
											: undefined,
									content:
										($currentWebhook?.content?.length ?? 0) > 0
											? $currentWebhook?.content
											: undefined
								}),
								headers: {
									'Content-Type': 'application/json'
								}
							});
							if (result.status !== 204) {
								const responseBody = await result.json();
								alert(`Error sending webhook: ${responseBody.message}`);
							} else {
								alert('Webhook sent successfully!');
							}
						}}
						id="firewebhook"
						disabled={!(
							WEBHOOK_URL_REGEX.test($currentWebhook?.url ?? '') &&
							Object.entries($currentEmbed).filter(
								([k, v]) =>
									['authorName', 'title', 'description', 'fields'].includes(k) && v.length > 0
							).length > 0
						)}
						class="discord-btn btn-success w-full lg:w-1/3 mt-2 !py-2">Send Now</button
					>
				</div>
			</div>
		</div>
		<div class="lg:relative">
			<div class="lg:fixed lg:h-cx1 lg:w-[50vw] top-[88px] lg:overflow-y-scroll">
				<div class="flex justify-center">
					<Embed />
				</div>
			</div>
		</div>
	</div>
</div>

{#if showSaveInBrowserModal}
	<Modal
		onClose={() => (showSaveInBrowserModal = false)}
		label="Save in Browser"
		formInputFields={[{ label: 'Label' }]}
		onSubmit={(values) => {
			const label = values[0].value ?? '';
			const embed = JSON.stringify($currentEmbed);
			const storedEmbeds = localStorage.getItem('embeds')
				? JSON.parse(localStorage.getItem('embeds') ?? '[]')
				: [];
			storedEmbeds.push({
				label: label.length > 0 ? label : `Untitled Embed (${storedEmbeds.length + 1})`,
				embed
			});
			localStorage.setItem('embeds', JSON.stringify(storedEmbeds));
			showSaveInBrowserModal = false;
		}}
	/>
{/if}

<DiscordBanner />

<style>
	span.label {
		font-size: 12px;
	}

	.code-btn-group button:first-child {
		border-radius: 3px 0 0 0;
	}

	.code-btn-group button:last-child {
		border-radius: 0 3px 0 0;
	}

	.codebox::-webkit-scrollbar {
		width: 4px;
		height: 8px;
		border-radius: 4px;
	}

	.codebox::-webkit-scrollbar-track {
		background: #3e4045;
		border-radius: 4px;
	}

	.codebox::-webkit-scrollbar-thumb {
		background: #26292c;
		border-radius: 4px;
	}
</style>
