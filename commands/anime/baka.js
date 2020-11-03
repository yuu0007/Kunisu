const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch')

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'baka',
			memberName: 'baka',
			group: 'anime',
			description: 'Sends an anime baka image!'
		});
	}

	async run(msg) {
		const embed = new MessageEmbed()
			.setDescription('Getting the image...');
		const message = await msg.say(embed);
		const { body } = await request.get('https://api.kunisu.tk/baka');
		const emb = new MessageEmbed()
			.setImage(body.url)
			.setColor('RANDOM')
			.setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL({ size: 4096, dynamic: true }))
			.setTimestamp();
		message.edit(emb);
	}
};