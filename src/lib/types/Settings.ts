export interface Settings {
	exportFramework: 'discordJs' | 'discordPy' | 'json' | 'jda';
}

export interface WebhookData {
	url?: string;
	username?: string;
	avatarUrl?: string;
	content?: string;
}
