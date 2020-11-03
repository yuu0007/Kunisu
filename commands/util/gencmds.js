const { Command } = require('discord.js-commando');
const hastebin = require('hastebin');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'gencmds',
			aliases: ['gc'],
			group: 'util',
			memberName: 'gencmds',
			description: 'Generates a markdown file for Kunisu\'s README.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const list = this.client.registry.groups
			.map(g => {
				const commands = g.commands.filter(c => !c.hidden);
				return `\n### ${g.name}:\n\n${commands.map(c => {
					const extra = `${c.ownerOnly ? ' (Owner-Only)' : ''}${c.nsfw ? ' (NSFW)' : ''}`;
					return `* **${c.name}:** ${c.description}${extra}`;
				}).join('\n')}`;
			});
		const text = `Total: ${this.client.registry.commands.size}\n${list.join('\n')}`;
		hastebin.createPaste(text, {
			raw: false,
			contentType: 'md',
			server: 'https://hastebin.com'
		})
		.then(url => msg.direct(url));
		msg.say('Check your direct messages!');
	}
};