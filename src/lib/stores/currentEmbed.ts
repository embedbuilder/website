import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';

import type { AppEmbed } from '../types';

const defaultValue = { fields: [] };
const store: Writable<AppEmbed> = writable<AppEmbed>(defaultValue);

store.update(() => {
	if (browser) {
		const localStoredEmbed = localStorage.getItem('currentEmbed');
		const embed = localStoredEmbed ? JSON.parse(localStoredEmbed) : defaultValue;
		return embed;
	}
});

store.subscribe((value) => {
	if (browser) window.localStorage.setItem('currentEmbed', JSON.stringify(value));
});

export default store;
