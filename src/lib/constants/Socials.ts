import { faGithub, faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

export enum Social {
	Twitter = 'twitter',
	Github = 'github',
	Email = 'email',
	Discord = 'discord'
}

export interface SocialData {
	name: string;
	url: string;
	icon: IconDefinition;
	primaryColor: string;
}

export const socials: Record<Social, SocialData> = {
	[Social.Twitter]: {
		name: 'Twitter',
		url: 'https://twitter.com/embedbuilder',
		icon: faTwitter,
		primaryColor: '#1c9bf0'
	},
	[Social.Github]: {
		name: 'Github',
		url: 'https://github.com/embedbuilder/website',
		icon: faGithub,
		primaryColor: '#e6edf3'
	},
	[Social.Email]: {
		name: 'Email',
		url: 'mailto:support@embedbuilder.com',
		icon: faEnvelope,
		primaryColor: '#ffff00'
	},
	[Socials.Discord]: {
		name: 'Discord',
		url: 'https://discord.gg/AskvnXsYxd',
		icon: faDiscord,
		primaryColor: '#5865F2'
	},
};
