<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import DiscordBanner from '$lib/components/DiscordBanner.svelte';
	import Embed from '$lib/components/Embed.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import { socials } from '$lib/constants/Socials';
	import EmbedExporter from '$lib/functions/EmbedExporter.js';
	import { b64ToUtf8, generateUid, utf8ToB64 } from '$lib/functions/Utility.js';
	import currentWebhook from '$lib/stores/WebhookData';
	import currentEmbed from '$lib/stores/currentEmbed';
	import settings from '$lib/stores/settings';
	import type { AppEmbed } from '$lib/types';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let exportedCode = '';

	let WEBHOOK_URL_REGEX =
		/^https:\/\/((canary|ptb)\.)?discord.com\/api(\/v\d+)?\/webhooks\/(\d+)\/([\w-]+)$/;

	let embed: AppEmbed = {
		fields: []
	};

	$: if ($settings.exportFramework)
		exportedCode = new EmbedExporter(embed)[$settings.exportFramework]();

	$: if (browser) {
		try {
			const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
			if (searchParams.has('e')) {
				embed = JSON.parse(b64ToUtf8(searchParams.get('e') as string));
			}
		} catch (e) {
			alert('Invalid embed code providen in URL');
			goto('/');
		}
	}

	$: if (browser && embed) {
		const url = `${location.protocol}//${location.host}/?e=${utf8ToB64(JSON.stringify(embed))}`;
		window.history.replaceState({}, '', url);
	}

	if ($currentEmbed && !Object.keys(embed).length) {
		embed = $currentEmbed;
	}

	$: currentEmbed.set(embed);
</script>

<div class="flex flex-col pb-20">
	<div class="grid grid-cols-1 lg:grid-cols-2 pt-5 gap-x-8 gap-y-12 pb-10">
		<div class=" animate__animated animate__backInLeft">
			<div class="pl-5 pr-5 flex flex-col gap-y-8">
				<div class="-mb-3 flex flex-row space-x-5">
					{#each Object.entries(socials) as [id, social]}
						<a href={social.url} target="_blank" title={social.name}>
							<Fa
								icon={social.icon}
								class="text-gray-400 hover:opacity-75 duration-200 text-xl font-bold flex flex-row items-center"
							/>
						</a>
					{/each}
				</div>
				<a
					class="-mb-4 text-white hover:text-gray-400 duration-200 text-2xl font-bold flex flex-row items-center"
					href="/"
				>
					EmbedBuilder for Discord
				</a>
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
						bind:value={embed.authorName}
						label="Author Name"
					/>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10">
						<FormInput maxLength={0} height={44} bind:value={embed.authorUrl} label="Author Url" />
						<FormInput
							maxLength={0}
							height={44}
							bind:value={embed.authorImageUrl}
							label="Author Image Url"
						/>
					</div>
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">General</p>
					<FormInput maxLength={256} bind:value={embed.title} label="Title" />
					<FormInput maxLength={256} bind:value={embed.titleUrl} height={44} label="Title Url" />
					<FormInput maxLength={4096} bind:value={embed.description} label="Description" />
				</div>
				<div>
					<p class="uppercase text-[#B9BBBE] font-medium mb-2">Images</p>
					<FormInput
						maxLength={0}
						height={44}
						bind:value={embed.thumbnailImageUrl}
						label="Thumbnail Image Url"
					/>
					<FormInput maxLength={0} height={44} bind:value={embed.imageUrl} label="Image Url" />
				</div>
				<div class="flex flex-col gap-y-6">
					<p class="uppercase text-[#B9BBBE] font-medium">Fields</p>
					{#if embed.fields.length > 0}
						{#each embed.fields as field}
							<div class="flex flex-row items-center w-full relative">
								<button
									title="Delete this field"
									class="-mb-10 hidden xl:block mr-5 hover:opacity-70 duration-200 absolute xl:relative right-0 bottom-4"
									on:click={() =>
										(embed.fields = (embed.fields ?? []).filter((f) => f.id !== field.id))}
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
										<FormInput height={44} maxLength={256} label="Name" bind:value={field.name} />
									</div>
									<div class="xl:col-span-4">
										<FormInput
											height={44}
											maxLength={1024}
											label="Value"
											bind:value={field.value}
										/>
									</div>
									<div class="flex flex-row items-center h-full mt-2.5 xl:col-span-2">
										<Checkbox label="Inline" bind:value={field.inline} />

										<button
											title="Delete this field"
											class="ml-auto xl:hidden"
											on:click={() =>
												(embed.fields = (embed.fields ?? []).filter((f) => f.id !== field.id))}
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
							disabled={(embed?.fields?.length ?? 0) > 25}
							on:click={() =>
								(embed.fields = (embed.fields ?? []).concat({
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
							bind:value={embed.footerText}
							label="Footer Text"
						/>
						<FormInput
							maxLength={0}
							height={44}
							bind:value={embed.footerIconUrl}
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
							bind:value={embed.timestamp}
							on:change={(e) => {
								// @ts-ignore
								embed.timestamp = e.target?.value;
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
								{exportedCode}
							</div>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-4 gap-y-4 2xl:gap-y-6">
					<button
						class="discord-btn btn-danger w-full md:w-auto"
						on:click={() =>
							(embed = {
								fields: []
							})}>Clear Embed</button
					>
					<button
						on:click={async () => {
							const response = await fetch('/api/v1/shorturl', {
								method: 'POST',
								body: JSON.stringify(new EmbedExporter(embed).toJSON())
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
							label="Message Content"
						/>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 mt-3">
						<FormInput
							maxLength={32}
							height={44}
							value={$currentWebhook?.username}
							label="Author Name"
						/>
						<FormInput
							maxLength={0}
							height={44}
							value={$currentWebhook?.avatarUrl}
							label="Author Avatar Url"
						/>
					</div>
					<button
						on:click={async () => {
							if (!$currentWebhook.url) return alert('Please enter a webhook URL');
							const expEmb = new EmbedExporter(embed).toDiscordJSON();
							const result = await fetch($currentWebhook.url, {
								method: 'POST',
								body: JSON.stringify({
									embeds: expEmb === '0' ? undefined : [expEmb],
									content: $currentWebhook?.content ?? undefined,
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
							Object.entries(embed).filter(
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
					<Embed bind:embed />
				</div>
			</div>
		</div>
	</div>
</div>

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
