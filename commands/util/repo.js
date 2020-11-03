const { Command } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'repo',
			memberName: 'repo',
			group: 'util',
			description: 'Responds with the bot\'s repository!'
		});
	}

	run(msg) {
		msg.say('This is my github repository! \n' + this.client.config.repolink);
	}
};