const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "remove",
			memberName: "remove",
			group: "web",
			description: "Removes a website from monitoring.",
		});
	}

	async run(msg) {
		const data = this.client.database.find(
			(x) => x.id === msg.author.id
		);
		if (!data)
			return msg.say("You don't have any site to monitor!");
		const value = this.client.database.indexOf(data);
		const array = [];
		this.client.database[value].link.forEach((m, i) => {
			array.push(`**[${i + 1}]**: \`${m}\``);
		});

		const embed = new MessageEmbed()
			.setTitle(
				"Please send the number of the website to remove."
			)
			.setColor("RANDOM")
			.setDescription(array.join("\n"));
		const message = await msg.say(embed);

		const responses = await msg.channel.awaitMessages(
			(m) => m.author.id === msg.author.id,
			{ time: 300000, max: 1 }
		);
		const repMsg = responses.first();
		if (!repMsg) {
			message.delete();
			return msg.say("Cancelled the command...");
		}

		if (isNaN(repMsg.content)) {
			message.delete();
			return msg.say("Invalid number provided.");
		}

		if (
			!this.client.database[value].link[
				parseInt(repMsg.content) - 1
			]
		) {
			message.delete();
			return msg.say("Invalid number provided.");
		}

		if (this.client.database[value].link.length === 1) {
			delete this.client.database[value];

			const filtered = this.client.database.filter((el) => {
				return el !== null && el !== "";
			});

			this.client.database = filtered;
		} else {
			delete this.client.database[value].link[
				parseInt(repMsg.content) - 1
			];

			const filtered = this.client.database.filter((el) => {
				return el !== null && el !== "";
			});

			this.client.database[value].link = filtered;
		}

		fs.writeFile(
			path.join(__dirname, "..", "..", "link.json"),
			JSON.stringify(this.client.database, null, 2),
			(err) => {
				if (err) console.error(err);
			}
		);

		repMsg.delete();
		message.delete();

		return msg.say("Removed the website from monitoring.");
	}
};
