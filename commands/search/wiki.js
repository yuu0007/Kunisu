const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const wtf = require("wtf_wikipedia");
wtf.extend(require("wtf-plugin-nsfw"));

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "wiki",
			aliases: ["wikipedia"],
			memberName: "wiki",
			group: "search",
			description: "Searches wikipedia for your query.",
			args: [
				{
					key: "query",
					prompt:
						"What would you like to search on wikipedia?",
					type: "string",
				},
			],
		});
	}

	async run(msg, { query }) {
		const m = await msg.embed({
			description: "Fetching the results...",
		});
		const data = await wtf.fetch(query);
		if (data.nsfw().safe_for_work === false && !msg.channel.nsfw) {
			const embe = new MessageEmbed().setDescription(
				`The following content has NSFW Content:\nReason: ${
					data.nsfw().reason
				}`
			);
			return m.edit(embe);
		}
		const embed = new MessageEmbed()
			.setTitle(data.title())
			.setDescription(data.text())
			.setThumbnail(data.images(0).thumbnail())
			.setURL(data.url())
			.setFooter(`Requested by ${msg.author.tag}`)
			.setTimestamp()
			.setColor("RANDOM");
		return m.edit(embed);
	}
};