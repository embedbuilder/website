export interface AppEmbed {
	authorImageUrl?: string;
	authorName?: string;
	authorUrl?: string;
	title?: string;
	titleUrl?: string;
	description?: string;
	thumbnailImageUrl?: string;
	fields: { id: string; name: string; value: string; inline?: boolean }[];
	imageUrl?: string;
	footerIconUrl?: string;
	footerText?: string;
	timestamp?: string;
	color?: string;
}
