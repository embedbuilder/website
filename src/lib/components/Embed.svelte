<script lang="ts">
	import { EMOJI_REGEX } from '$lib/functions/EmojiValidator';
	import { humanizeDate } from '$lib/functions/Utility.js';
	import type { AppEmbed } from '$lib/types';
	import Escape from 'escape-html';

	export let embed: AppEmbed = {
		fields: []
	};

	if (!embed.color) embed.color = '#FFFFFF';

	const applyMarkdown = (str: string, onlyEmojis = false) => {
		str = Escape(str);

		str = str
			.replace(EMOJI_REGEX, (_) => {
				const fileName = _.codePointAt(0)?.toString(16);
				return `<img alt="Emoji" class="emoji" src="/emojis/${fileName}.svg" />`;
			})
			.replace(
				/\&lt\;a:\w+:(\d+)\&gt\;/g,
				'<img alt="Emoji" class="emoji" src="https://cdn.discordapp.com/emojis/$1.gif?size=96&quality=lossless" />'
			)
			.replace(
				/\&lt\;:\w+:(\d+)\&gt\;/g,
				'<img alt="Emoji" class="emoji" src="https://cdn.discordapp.com/emojis/$1.webp?size=96&quality=lossless" />'
			);
		if (onlyEmojis) return str;

		return str
			.replace(/\*\*\*([^*]+)\*\*\*/g, '<b><i>$1</i></b>')
			.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
			.replace(/\*([^*]+)\*/g, '<i>$1</i>')
			.replace(/_([^_]+)_/g, '<u>$1</u>')
			.replace(/~~([^~]+)~~/g, '<strike>$1</strike>')
			.replace(/`([^`]+)`/g, '<code>$1</code>');
	};

	let editingFields: string[] = [];

	const startEditing = (field: string) => {
		if (editingFields.indexOf(field) !== -1) return;
		editingFields = editingFields.concat(field);
	};
</script>

<div class="bg-[#2f3136] embed-container relative overflow-hidden">
	{#if embed.color}
		<label for="embedcolor" class="sr-only"> Embed Color </label>
		<input
			id="embedcolor"
			type="color"
			bind:value={embed.color}
			class="absolute left-0 top-0 h-full bg-black colorbar"
		/>
	{/if}
	{#if embed.thumbnailImageUrl}
		<div class="thumbnail">
			<img src={embed.thumbnailImageUrl} alt="Thumbnail" width={80} height={80} />
		</div>
	{/if}
	{#if embed.authorName || embed.authorImageUrl || embed.authorUrl}
		<div class="author flex flex-row items-center">
			{#if embed.authorImageUrl}
				<img src={embed.authorImageUrl} width="24" height="24" class="avatar" alt="Embed Author" />
			{/if}
			{#if embed.authorName}
				{#if editingFields.indexOf('authorName') !== -1}
					<textarea
						on:keydown={(e) =>
							['Escape'].includes(e.key) &&
							(editingFields = editingFields.filter((f) => f !== 'authorName'))}
						class="w-full resize-none bg-transparent text-white border-gray-300 border-2 rounded-md py-1 px-3"
						bind:value={embed.authorName}
						on:blur={() => {
							editingFields = editingFields.filter((f) => f !== 'authorName');
						}}
					/>
				{:else}
					<div on:dblclick|preventDefault={() => startEditing('authorName')}>
						{#if embed.authorUrl}
							<a
								href={embed.authorUrl}
								rel="noreferrer"
								target="_blank"
								class="cursor-pointer hover:underline"
								>{@html applyMarkdown(embed.authorName, true)}</a
							>
						{:else}
							<span class="break-words">{@html applyMarkdown(embed.authorName, true)}</span>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	{/if}
	{#if embed.title}
		<div class="title">
			{#if editingFields.indexOf('title') !== -1}
				<textarea
					on:keydown={(e) =>
						['Escape'].includes(e.key) &&
						(editingFields = editingFields.filter((f) => f !== 'title'))}
					class="w-full resize-none bg-transparent text-white border-gray-300 border-2 rounded-md py-1 px-3"
					bind:value={embed.title}
					on:blur={() => {
						editingFields = editingFields.filter((f) => f !== 'title');
					}}
				/>
			{:else}
				<div on:dblclick|preventDefault={() => startEditing('title')}>
					{#if embed.titleUrl}
						<a
							href={embed.titleUrl}
							rel="noreferrer"
							target="_blank"
							class="break-words title cursor-pointer text-[#00aff4] hover:underline"
						>
							{embed.title}
						</a>
					{:else}
						<span class="title break-words">{@html applyMarkdown(embed.title, true)}</span>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	{#if embed.description}
		<div style="white-space:pre-line" class="description break-words">
			{#if editingFields.indexOf('description') !== -1}
				<textarea
					on:keydown={(e) =>
						['Escape'].includes(e.key) &&
						(editingFields = editingFields.filter((f) => f !== 'description'))}
					class="w-full resize-none bg-transparent text-white border-gray-300 border-2 rounded-md py-1 px-3"
					bind:value={embed.description}
					on:blur={() => {
						editingFields = editingFields.filter((f) => f !== 'description');
					}}
				/>
			{:else}
				<div on:dblclick|preventDefault={() => startEditing('description')}>
					{@html applyMarkdown(embed.description)}
				</div>
			{/if}
		</div>
	{/if}
	{#if embed.fields && embed.fields?.length > 0}
		<div class="fields grid grid-cols-1 md:grid-cols-3 gap-y-3">
			{#each embed.fields.filter((f) => f.name.length > 0 || f.value.length > 0) as field}
				<div class="field flex flex-col {field.inline ? 'col-span-1' : 'col-span-3'}">
					{#if editingFields.indexOf(`fieldname.${field.id}`) !== -1}
						<textarea
							on:keydown={(e) =>
								['Escape'].includes(e.key) &&
								(editingFields = editingFields.filter((f) => f !== `fieldname.${field.id}`))}
							class="w-full resize-none bg-transparent text-white border-gray-300 border-2 rounded-md py-1 px-3"
							bind:value={embed.fields[embed.fields.indexOf(field)].name}
							on:blur={() => {
								editingFields = editingFields.filter((f) => f !== `fieldname.${field.id}`);
							}}
						/>
					{:else}
						<div on:dblclick|preventDefault={() => startEditing(`fieldname.${field.id}`)}>
							<span class="field-title break-words">{@html applyMarkdown(field.name)}</span>
						</div>
					{/if}
					{#if editingFields.indexOf(`fieldvalue.${field.id}`) !== -1}
						<textarea
							on:keydown={(e) =>
								['Escape'].includes(e.key) &&
								(editingFields = editingFields.filter((f) => f !== `fieldvalue.${field.id}`))}
							class="w-full resize-none bg-transparent text-white border-gray-300 border-2 rounded-md py-1 px-3"
							bind:value={embed.fields[embed.fields.indexOf(field)].value}
							on:blur={() => {
								editingFields = editingFields.filter((f) => f !== `fieldvalue.${field.id}`);
							}}
						/>
					{:else}
						<div on:dblclick|preventDefault={() => startEditing(`fieldvalue.${field.id}`)}>
							<span class="field-value break-words">{@html applyMarkdown(field.value)}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	{#if embed.imageUrl}
		<div class="image">
			<img src={embed.imageUrl} alt="Embed" />
		</div>
	{/if}
	{#if embed.footerText || embed.footerIconUrl || embed.timestamp}
		<div class="footer flex flex-row items-center">
			{#if embed.footerIconUrl}
				<img
					src={embed.footerIconUrl}
					width={20}
					height={20}
					class="footer-icon"
					alt="Embed Footer"
				/>
			{/if}
			{#if embed.footerText}
				{#if editingFields.indexOf('footerText') !== -1}
					<textarea
						on:keydown={(e) =>
							['Escape'].includes(e.key) &&
							(editingFields = editingFields.filter((f) => f !== 'footerText'))}
						class="w-full resize-none bg-transparent text-white border-gray-300 border-2 rounded-md py-1 px-3"
						bind:value={embed.footerText}
						on:blur={() => {
							editingFields = editingFields.filter((f) => f !== 'footerText');
						}}
					/>
				{:else}
					<div on:dblclick|preventDefault={() => startEditing('footerText')}>
						<span class="footer-text break-words"
							>{@html applyMarkdown(embed.footerText, true)}</span
						>
					</div>
				{/if}
			{/if}
			{#if embed.timestamp}
				{#if embed.footerText}
					<span class="mx-1 select-none"> • </span>
				{/if}
				<span class="timestamp">{humanizeDate(new Date(embed.timestamp))}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	input[type='color'] {
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		border: none;
	}
	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}
	input[type='color']::-webkit-color-swatch {
		border: none;
	}

	.embed-container {
		width: clamp(0px, 488px, 90%);
		padding: 16px 16px 22px 16px;
		border-radius: 5px;
		color: #fff;
	}

	.embed-container .thumbnail {
		position: absolute;
		right: 16px;
		top: 16px;
	}

	.embed-container .thumbnail img {
		border-radius: 3px;
	}

	.embed-container .author {
		font-weight: 600;
		font-size: 14px;
	}

	.embed-container .author .avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		margin: 0 8px 0 0;
	}

	.embed-container .title {
		font-size: 16px;
		font-weight: 600;
		margin: 8px 0 0 0;
	}

	.embed-container .description {
		color: #dcddde;
		font-size: 14px;
		font-weight: 400;
		margin: 8px 0 0 0;
	}

	.embed-container .fields {
		margin: 8px 0 0 0;
		font-size: 14px;
	}

	.embed-container .fields .field-title {
		font-weight: 600;
	}

	.embed-container .image {
		margin: 12px 0 0 0;
	}

	.embed-container .image img {
		border-radius: 3px;
	}

	.embed-container .footer {
		margin: 12px 0 0 0;
		font-size: 12px;
	}

	.embed-container .footer .footer-icon {
		display: inline;
		margin: 0 8px 0 0;
		border-radius: 50%;
	}

	.colorbar {
		width: 3px;
	}
</style>
