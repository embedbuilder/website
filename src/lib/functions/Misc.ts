import { browser } from '$app/environment';

export const humanizeDate = (date: Date) => {
	const startOfDay = new Date();
	startOfDay.setUTCHours(0, 0, 0, 0);
	const endOfDay = new Date();
	endOfDay.setUTCHours(23, 59, 59, 999);
	if (date < endOfDay && date > startOfDay)
		return `Today at ${`0${date.getUTCHours()}`.slice(-2)}:${`0${date.getUTCMinutes()}`.slice(-2)}`;
	return `${`0${date.getUTCDate() + 1}`.slice(-2)}/${`0${date.getUTCMonth() + 1}`.slice(
		-2
	)}/${date.getUTCFullYear()}`;
};

export const generateUid = () => Math.random().toString(36).slice(2, 10);

export const renderEmojis = (isBrowser: any) => {
	if (browser) eval("twemoji.parse(document.body, { ext: '.svg', size: 'svg' });");
};
