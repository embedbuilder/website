import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

import type { WebhookData } from '../types';

const defaultValue = {};
const store: Writable<WebhookData> = writable<WebhookData>(defaultValue);

store.update(() => {
	if (browser) {
		const localStoredEmbed = localStorage.getItem('webhook');
		const embed = localStoredEmbed ? JSON.parse(localStoredEmbed) : defaultValue;
		return embed;
	}
});

store.subscribe((value) => {
	if (browser) window.localStorage.setItem('webhook', JSON.stringify(value));
});

export default store;
