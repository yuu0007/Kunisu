const { posts } = require("rule34js");
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "rule34",
			aliases: ["r34"],
			memberName: "rule34",
			group: "nsfw",
			nsfw: true,
			description: "Searches rule34 for your query.",
			args: [
				{
					key: "query",
					prompt:
						"What would you like to search in rule34?",
					type: "string",
				},
			],
		});
	}

	async run(msg, { query }) {
		const embe = await msg.embed({
			description: "Getting the image...",
		});
		const res = await posts({ tags: [query] });
		const embed = new MessageEmbed()
			.setImage(
				res.posts[
					Math.floor(
						Math.random() * res.posts.length
					)
				].file_url
			)
			.setColor("RANDOM")
			.setFooter(
				`Requested by ${msg.author.tag}`,
				msg.author.displayAvatarURL({
					dynamic: true,
					size: 4096,
				})
			);
		embe.edit(embed);
	}
};
