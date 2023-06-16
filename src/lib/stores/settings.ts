import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';

import type { Settings } from '../types';

const defaultValue: Settings = {
	exportFramework: 'discordJs'
};

const store: Writable<Settings> = writable<Settings>(defaultValue);

store.update(() => {
	if (browser) {
		const localStoredSettings = localStorage.getItem('settings');
		return localStoredSettings ? JSON.parse(localStoredSettings) : defaultValue;
	}
	return defaultValue;
});

store.subscribe((value) => {
	if (browser) window.localStorage.setItem('settings', JSON.stringify(value));
});

export default store;
