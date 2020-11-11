const { Command } = require("discord.js-commando");
const { isURL } = require("../../utils/util.js");
const fs = require("fs");
const path = require("path");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "monitor",
			memberName: "monitor",
			group: "web",
			description: "Monitor a website for you!",
			args: [
				{
					key: "url",
					prompt:
						"What is the url of the website that you want to monitor?",
					type: "string",
					validate: (msg) => isURL(msg),
				},
			],
		});
	}

	run(msg, { url }) {
		const check = this.client.database.find(
			(x) => x.id === msg.author.id
		);

		if (check) {
			if (check.link.length === 5) {
				return msg.say(
					"You can only monitor upto 5 websites!"
				);
			}

			const numb = this.client.database.indexOf(check);
			this.client.database[numb].link.push(url);
		} else {
			this.client.database.push({
				id: msg.author.id,
				name: msg.author.username,
				link: [url],
			});
		}

		fs.writeFile(
			path.join(__dirname, "..", "..", "link.json"),
			JSON.stringify(this.client.database, null, 2),
			(err) => {
				if (err) console.error(err);
			}
		);
		msg.say("Added your website for monitoring!");
		return msg.delete();
	}
};
