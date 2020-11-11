const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "webstats",
			aliases: ["wstats"],
			memberName: "webstats",
			group: "web",
			description:
				"Shows the total statistics of the websites that you're monitoring!",
		});
	}

	run(msg) {
		const data = this.client.database.find(
			(x) => x.id === msg.author.id
		);
		if (!data)
			return msg.say("You don't have any site to monitor!");
		const embed = new MessageEmbed()
			.setAuthor(`You have ${data.link.length} website(s)`)
			.setColor("RANDOM")
			.setDescription(
				`**:white_check_mark: ${data.link.join(
					"\n\n:white_check_mark: "
				)}**`
			);
		msg.direct(embed).catch(() => {
			return msg.say("You have DMs disabled!");
		});
		return msg.say("Check your direct messages!");
	}
};
