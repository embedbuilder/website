import prisma from '$lib/server/functions/Database';
import type { RequestHandler } from '@sveltejs/kit';
import joi from 'joi';

const randomString = (length: number): string => {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};

const schema = joi.object({
	author_image_url: joi.string().uri().optional(),
	author_name: joi.string().optional().max(256),
	author_url: joi.string().uri().optional(),
	title: joi.string().optional().max(256),
	title_url: joi.string().uri().optional(),
	description: joi.string().optional().max(4096),
	thumbnail_image_url: joi.string().uri().optional(),
	fields: joi
		.array()
		.items(
			joi.object({
				name: joi.string().max(256).required(),
				value: joi.string().max(1024).required(),
				inline: joi.boolean().optional()
			})
		)
		.optional()
		.max(25),
	image_url: joi.string().uri().optional(),
	footer_icon_url: joi.string().uri().optional(),
	footer_text: joi.string().optional().max(2048),
	timestamp: joi.string().optional().isoDate(),
	color: joi.number().optional().min(0x000000).max(0xffffff)
});

export const GET = async ({ params }) => {
	const embed = await prisma.embed.findFirst({ where: { code: params.code, deletedAt: null } });
	if (!embed) return new Response(JSON.stringify({ error: 'Embed not found' }), { status: 404 });
	return new Response(
		JSON.stringify({
			id: embed.id,
			code: embed.code,
			author_image_url: embed.authorImageUrl,
			author_name: embed.authorName,
			author_url: embed.authorUrl,
			title: embed.title,
			title_url: embed.titleUrl,
			description: embed.description,
			thumbnail_image_url: embed.thumbnailImageUrl,
			fields: embed.fields.map((field: any) => ({
				name: field.name,
				value: field.value,
				inline: field.inline ?? false
			})),
			image_url: embed.imageUrl,
			footer_icon_url: embed.footerIconUrl,
			footer_text: embed.footerText,
			timestamp: embed.timestamp,
			color: embed.color,
			created_at: embed.createdAt
		}),
		{
			headers: {
				'Cache-Control': 'public, max-age=604800, immutable',
				'Content-Type': 'application/json'
			}
		}
	);
};

export const POST = (async ({ request }) => {
	const json = await request.json();
	const { error } = schema.validate(json);
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
	if (!Object.keys(json).length)
		return new Response(JSON.stringify({ error: 'No data provided' }), { status: 400 });

	const code = randomString(12);

	await prisma.embed.create({
		data: {
			code,
			authorImageUrl: json.author_image_url,
			authorName: json.author_name,
			authorUrl: json.author_url,
			title: json.title,
			titleUrl: json.title_url,
			description: json.description,
			thumbnailImageUrl: json.thumbnail_image_url,
			fields: json.fields,
			imageUrl: json.image_url,
			footerIconUrl: json.footer_icon_url,
			footerText: json.footer_text,
			timestamp: json.timestamp,
			color: json.color
		}
	});

	return new Response(JSON.stringify({ code }), {
		headers: {
			'Cache-Control': 'public, max-age=604800, immutable',
			'Content-Type': 'application/json'
		}
	});
}) satisfies RequestHandler;
