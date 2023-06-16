import type { Handle } from '@sveltejs/kit';

const htmlMetaBuilder = (tags: { [key: string]: string }, customHead = '') => {
	const metaTags = Object.keys(tags).reduce((acc, key) => {
		return acc + `<meta name="${key}" content="${tags[key]}" />`;
	}, '');
	return `<!doctype html>\n<html lang="en"><head><link rel="icon" href="%sveltekit.assets%/favicon.png" />${metaTags}${customHead}</head></html>`;
};

const b64toString = (s: string) => decodeURIComponent(atob(s));

export const defaultResponse = async ({
	event,
	resolve
}: {
	event: { request: Request };
	resolve: any;
}) => {
	const response: Response = await resolve(event);
	response.headers.delete('x-sveltekit-page');
	return response;
};

export const handle = (async ({ event, resolve }) => {
	const userAgent = event.request.headers.get('user-agent') ?? '';
	const embedHash = new URL(event.request.url).searchParams.get('e');
	if (!embedHash || !userAgent.toLowerCase().includes('discord'))
		return defaultResponse({ event, resolve });
	let embedData;
	try {
		embedData = JSON.parse(b64toString(embedHash));
	} catch (e) {
		return new Response('Embed Parsing failed...\n' + e);
	}
	const tags: {
		[key: string]: string;
	} = {};
	if (embedData.title) {
		tags['og:title'] = embedData.title;
		tags['twitter:title'] = embedData.title;
	}
	if (embedData.description) {
		tags['og:description'] = embedData.description;
		tags['twitter:description'] = embedData.description;
		tags['description'] = embedData.description;
	}
	tags['theme-color'] = embedData.color ?? '#7289DA';
	return new Response(
		htmlMetaBuilder(tags, `<title>${embedData.title ?? 'Untitled Embed'}</title>`),
		{
			headers: {
				'content-type': 'text/html'
			}
		}
	);
}) satisfies Handle;
