import prisma from '$lib/server/functions/Database';
import { redirect, type RequestHandler } from '@sveltejs/kit';

const utf8ToB64 = (s: string) => btoa(encodeURIComponent(s));

export const GET = (async ({ params }) => {
	const { code } = params;
	if (!code) throw redirect(307, '/');
	const dbEmbed = await prisma.embed.findFirst({
		where: {
			code,
			deletedAt: null
		}
	});
	if (!dbEmbed) throw redirect(307, '/');
	throw redirect(
		307,
		`/?e=${utf8ToB64(
			JSON.stringify({
				authorImageUrl: dbEmbed.authorImageUrl,
				authorName: dbEmbed.authorName,
				authorUrl: dbEmbed.authorUrl,
				title: dbEmbed.title,
				titleUrl: dbEmbed.titleUrl,
				description: dbEmbed.description,
				thumbnailImageUrl: dbEmbed.thumbnailImageUrl,
				fields: dbEmbed.fields,
				imageUrl: dbEmbed.imageUrl,
				footerIconUrl: dbEmbed.footerIconUrl,
				footerText: dbEmbed.footerText,
				timestamp: dbEmbed.timestamp,
				color: dbEmbed.color ? `#${dbEmbed.color.toString(16).padStart(6, '0')}` : undefined
			})
		)}`
	);
}) satisfies RequestHandler;
