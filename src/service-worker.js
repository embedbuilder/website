/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	const addFilesToCache = async () => {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	};

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	const removeOldCache = async () => {
		const keys = await caches.keys();
		for (const key of keys) if (key !== CACHE) await caches.delete(key);
	};

	event.waitUntil(removeOldCache());
});

self.addEventListener('fetch', (event) => {
	const respondFromCache = async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(event.request);
			if (response) return response;
		}

		try {
			const response = await fetch(event.request);
			if (response.ok) await cache.put(event.request, response.clone());
			return response;
		} catch (error) {
			return cache.match(event.request);
		}
	};

	event.respondWith(respondFromCache());
});
