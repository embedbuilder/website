import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

interface DissmissableContents {
	[key: string]: boolean;
}

const defaultValue = {};
const store: Writable<DissmissableContents> = writable<DissmissableContents>(defaultValue);

store.update(() => {
	if (browser) {
		const localStoredDissmissableContents = localStorage.getItem('dissmissableContents');
		return localStoredDissmissableContents
			? JSON.parse(localStoredDissmissableContents)
			: defaultValue;
	}
});

store.subscribe((value) => {
	if (browser) window.localStorage.setItem('dissmissableContents', JSON.stringify(value));
});

export default store;
