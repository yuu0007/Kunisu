const { Command } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			memberName: 'restart',
			group: 'util',
			ownerOnly: true,
			guarded: true,
			description: 'Attempts to restart the bot if its running under pm2.'
		});
	}
	
        async run(msg) {
		await msg.react('✅')
		process.exit();
	}
};