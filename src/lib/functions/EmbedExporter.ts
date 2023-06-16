import type { AppEmbed } from '../types';

export default class EmbedExporter {
	private authorImageUrl?: string;
	private authorName?: string;
	private authorUrl?: string;
	private title?: string;
	private titleUrl?: string;
	private description?: string;
	private thumbnailImageUrl?: string;
	private fields?: { name: string; value: string; inline?: boolean }[];
	private imageUrl?: string;
	private footerIconUrl?: string;
	private footerText?: string;
	private timestamp?: string;
	private color?: string;
	private indentWidth = '  ';

	constructor(payload: AppEmbed) {
		Object.assign(this, payload);
	}

	private indent(times: number) {
		return this.indentWidth.repeat(times);
	}

	private cleanString(str: string) {
		return str
			.replace(/'/g, "\\'")
			.replace(/"/g, '\\"')
			.replace(/\n/g, '\\n')
			.replace(/>/g, '&#62;')
			.replace(/</g, '&#60;');
	}

	private exportVariables(): string[] {
		return (
			[
				this.authorImageUrl,
				this.authorName,
				this.authorUrl,
				this.title,
				this.titleUrl,
				this.description,
				this.thumbnailImageUrl,
				this.fields?.map((r) => `${r.name} ${r.value}`),
				this.imageUrl,
				this.footerIconUrl,
				this.footerText
			]
				.join(' ')
				.match(/\{(.*?)}/g)
				?.map((r) => r.slice(1, -1))
				.filter((r) => r.length > 0) || []
		);
	}

	private formatString(str: string, variables: string[] = this.exportVariables()): string {
		if (variables.length === 0) return `'${this.cleanString(str)}'`;
		return `\`${str.replace(/\{(.*?)}/g, (_, match) => {
			return `\${${match}}`;
		})}\``;
	}

	private formatStringPython(str: string, variables: string[] = this.exportVariables()): string {
		if (variables.length === 0) return `'${this.cleanString(str)}'`;
		return `f'${str.replace(/\{(.*?)}/g, '{$1}')}'`;
	}

	private formatStringJava(str: string, variables: string[] = this.exportVariables()): string {
		if (variables.length === 0) return `"${this.cleanString(str)}"`;
		const varsInString =
			str
				.match(/\{(.*?)}/g)
				?.map((r) => r.slice(1, -1))
				.filter((r) => r.length > 0) || [];
		if (varsInString.length === 0) return `"${this.cleanString(str)}"`;
		const args = varsInString.map((r) => r.replace(/"/g, '\\"'));
		return `String.format("${this.cleanString(str.replaceAll(/\{(.*?)}/g, '%s'))}", ${args
			.map((r) => `${r}`)
			.join(', ')})`;
	}

	public discordJs() {
		const v = this.exportVariables();
		const lines = Array.from(new Set(v)).map((r) => `const ${r} = "";`);
		if (v.length > 0) lines.push('');
		lines.push('const embed = new EmbedBuilder()');
		if (this.authorName || this.authorUrl || this.authorImageUrl) {
			lines.push(this.indent(1) + '.setAuthor({');
			if (this.authorName)
				lines.push(this.indent(2) + `name: ${this.formatString(this.authorName, v)},`);
			if (this.authorUrl) lines.push(this.indent(2) + `url: ${this.formatString(this.authorUrl)},`);
			if (this.authorImageUrl)
				lines.push(this.indent(2) + `iconUrl: ${this.formatString(this.authorImageUrl)},`);
			lines.push(this.indent(1) + '})');
		}
		if (this.title) lines.push(this.indent(1) + `.setTitle(${this.formatString(this.title, v)})`);
		if (this.titleUrl) lines.push(this.indent(1) + `.setURL(${this.formatString(this.titleUrl)})`);
		if (this.description)
			lines.push(this.indent(1) + `.setDescription(${this.formatString(this.description)})`);
		if (this.thumbnailImageUrl)
			lines.push(this.indent(1) + `.setThumbnail(${this.formatString(this.thumbnailImageUrl)})`);
		if (this.fields && this.fields.length > 0) {
			lines.push(this.indent(1) + '.addFields(');
			for (const field of this.fields) {
				lines.push(this.indent(2) + '{');
				lines.push(this.indent(3) + `name: ${this.formatString(field.name)},`);
				lines.push(this.indent(3) + `value: ${this.formatString(field.value)},`);
				if (field.inline) lines.push(this.indent(3) + `inline: ${field.inline},`);
				lines.push(this.indent(2) + '},');
			}
			lines.push(this.indent(1) + ')');
		}
		if (this.imageUrl)
			lines.push(this.indent(1) + `.setImage(${this.formatString(this.imageUrl)})`);
		if (this.footerText || this.footerIconUrl) {
			lines.push(this.indent(1) + '.setFooter({');
			if (this.footerText)
				lines.push(this.indent(2) + `text: ${this.formatString(this.footerText)},`);
			if (this.footerIconUrl)
				lines.push(this.indent(2) + `iconUrl: ${this.formatString(this.footerIconUrl)},`);
			lines.push(this.indent(1) + '})');
		}
		if (this.timestamp)
			lines.push(this.indent(1) + `.setTimestamp(${this.formatString(this.timestamp)})`);
		if (this.color)
			lines.push(this.indent(1) + `.setColor(0x${this.cleanString(this.color).slice(1)})`);
		lines[lines.length - 1] += ';';
		return lines.join('<br />');
	}

	public discordPy() {
		const v = this.exportVariables();
		const lines = Array.from(new Set(v)).map((r) => `${r} = "";`);
		let rep = 'embed = discord.Embed(';
		if (this.color) rep += `color=0x${this.color.slice(1)},`;
		if (this.title) rep += `title=${this.formatStringPython(this.title, v)},`;
		if (this.titleUrl) rep += `url=${this.formatStringPython(this.titleUrl, v)},`;
		if (this.description) rep += `description=${this.formatStringPython(this.description, v)},`;
		if (this.timestamp) rep += `timestamp=${this.formatStringPython(this.timestamp, v)}`;
		rep += ')';
		lines.push(rep);
		if (this.footerText || this.footerIconUrl) {
			let temp1 = 'embed.set_footer(';
			if (this.footerText) temp1 += `text=${this.formatStringPython(this.footerText, v)},`;
			if (this.footerIconUrl) temp1 += `icon_url=${this.formatStringPython(this.footerIconUrl, v)}`;
			lines.push(temp1 + ')');
		}
		if (this.authorName || this.authorUrl || this.authorImageUrl) {
			let temp2 = 'embed.set_author(';
			if (this.authorName) temp2 += `name=${this.formatStringPython(this.authorName, v)},`;
			if (this.authorUrl) temp2 += `url=${this.formatStringPython(this.authorUrl, v)},`;
			if (this.authorImageUrl)
				temp2 += `icon_url=${this.formatStringPython(this.authorImageUrl, v)}`;
			lines.push(temp2 + ')');
		}
		if (this.thumbnailImageUrl)
			lines.push(`embed.set_thumbnail(url=${this.formatStringPython(this.thumbnailImageUrl, v)})`);
		if (this.imageUrl)
			lines.push(`embed.set_image(url=${this.formatStringPython(this.imageUrl, v)})`);
		if (this.fields && this.fields.length > 0) {
			for (const field of this.fields) {
				let temp3 = 'embed.add_field(';
				temp3 += `name=${this.formatStringPython(field.name, v)},`;
				temp3 += `value=${this.formatStringPython(field.value, v)},`;
				if (!field.inline) temp3 += `inline=${field.inline}`;
				lines.push(temp3 + ')');
			}
		}
		return lines.join('<br />');
	}

	public jda() {
		const v = this.exportVariables();
		const lines = Array.from(new Set(v)).map((r) => `String ${r} = "";`);
		if (v.length > 0) lines.push('');
		lines.push('EmbedBuilder eb = new EmbedBuilder();');
		if (this.authorName)
			lines.push(
				`eb.setAuthor(${this.formatStringJava(this.authorName, v)}, ${
					this.authorUrl ? `${this.formatStringJava(this.authorUrl, v)}` : 'null'
				}, ${this.authorImageUrl ? `${this.formatStringJava(this.authorImageUrl, v)}` : 'null'});`
			);
		if (this.title) lines.push(`eb.setTitle(${this.formatStringJava(this.title, v)});`);
		if (this.color) lines.push(`eb.setColor(new Color(0x${this.color.slice(1)}));`);
		if (this.description)
			lines.push(`eb.setDescription(${this.formatStringJava(this.description, v)});`);
		if (this.fields && this.fields.length > 0)
			for (const field of this.fields)
				lines.push(
					`eb.addField(${this.formatStringJava(field.name, v)}, ${this.formatStringJava(
						field.value,
						v
					)}, ${(field.inline ?? false).toString()});`
				);
		if (this.imageUrl) lines.push(`eb.setImage(${this.formatStringJava(this.imageUrl, v)});`);
		if (this.thumbnailImageUrl)
			lines.push(`eb.setThumbnail(${this.formatStringJava(this.thumbnailImageUrl, v)});`);
		if (this.footerText)
			lines.push(
				`eb.setFooter(${this.formatStringJava(this.footerText, v)}, ${
					this.footerIconUrl ? `${this.formatStringJava(this.footerIconUrl, v)}` : 'null'
				});`
			);
		if (this.timestamp) lines.push(`eb.setTimestamp(${this.formatStringJava(this.timestamp, v)});`);
		return lines.join('<br />');
	}

	public json() {
		const json: any = {};
		if (this.title) json.title = this.title;
		json.type = 'rich';
		if (this.description) json.description = this.description;
		if (this.titleUrl) json.url = this.titleUrl;
		if (this.timestamp) json.timestamp = this.timestamp;
		if (this.color) json.color = parseInt(this.color.slice(1), 16);
		if (this.footerText) {
			json.footer = {};
			json.footer.text = this.footerText;
			if (this.footerIconUrl) json.footer.icon_url = this.footerIconUrl;
		}
		if (this.imageUrl) json.image = { url: this.imageUrl };
		if (this.thumbnailImageUrl) json.thumbnail = { url: this.thumbnailImageUrl };
		if (this.authorName) {
			json.author = {};
			json.author.name = this.authorName;
			if (this.authorUrl) json.author.url = this.authorUrl;
			if (this.authorImageUrl) json.author.icon_url = this.authorImageUrl;
		}
		if (this.fields && this.fields.length > 0) {
			json.fields = [];
			for (const field of this.fields) {
				const f: any = {};
				f.name = field.name;
				f.value = field.value;
				f.inline = field.inline ?? false;
				json.fields.push(f);
			}
		}
		return JSON.stringify(json, null, 2);
	}

	public toJSON() {
		return {
			author_image_url: this.authorImageUrl?.length ? this.authorImageUrl : undefined,
			author_name: this.authorName?.length ? this.authorName : undefined,
			author_url: this.authorUrl?.length ? this.authorUrl : undefined,
			title: this.title?.length ? this.title : undefined,
			title_url: this.titleUrl?.length ? this.titleUrl : undefined,
			description: this.description?.length ? this.description : undefined,
			thumbnail_image_url: this.thumbnailImageUrl?.length ? this.thumbnailImageUrl : undefined,
			fields: this.fields?.length ? this.fields : undefined,
			image_url: this.imageUrl?.length ? this.imageUrl : undefined,
			footer_icon_url: this.footerIconUrl?.length ? this.footerIconUrl : undefined,
			footer_text: this.footerText?.length ? this.footerText : undefined,
			timestamp: this.timestamp?.length ? this.timestamp : undefined,
			color: this.color ? parseInt(this.color?.slice(1), 16) : undefined
		};
	}

	public toDiscordJSON() {
		const json = this.toJSON();
		return {
			type: 'rich',
			title: json.title,
			description: json.description,
			url: json.title_url,
			timestamp: json.timestamp,
			color: json.color,
			footer: {
				text: json.footer_text,
				icon_url: json.footer_icon_url
			},
			image: {
				url: json.image_url
			},
			thumbnail: {
				url: json.thumbnail_image_url
			},
			author: {
				name: json.author_name,
				url: json.author_url,
				icon_url: json.author_image_url
			},
			fields: json.fields
		};
	}
}
