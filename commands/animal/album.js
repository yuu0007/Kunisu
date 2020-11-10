/* eslint-disable no-unused-vars */
const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const request = require("node-superfetch");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "album",
			memberName: "album",
			group: "animal",
			description: "Sends an animal album.",
		});
	}

	async run(msg) {
		let page = 1;
		const pages = [];
		const { body } = await request.get("https://api.kunisu.tk/cat");
		pages.push(body.url);
		const bod = await this.req("https://api.kunisu.tk/dog");
		pages.push(bod);
		const bo = await this.req("https://api.kunisu.tk/panda");
		pages.push(bo);
		const lmao = await this.req("https://api.kunisu.tk/redpanda");
		pages.push(lmao);
		const lol = await this.req(
			"https://some-random-api.ml/img/birb"
		);
		pages.push(lol);
		const helpme = await this.req(
			"https://some-random-api.ml/img/fox"
		);
		pages.push(helpme);
		const wtf = await this.req(
			"https://some-random-api.ml/img/koala"
		);
		pages.push(wtf);

		const { bod } = await request.get("https://api.kunisu.tk/dog");
		pages.push(bod.url);
		const { bo } = await request.get("https://api.kunisu.tk/panda");
		pages.push(bo.url);
		const { lmao } = await request.get(
			"https://api.kunisu.tk/redpanda"
		);
		pages.push(lmao.url);
		const { lol } = await request.get(
			"https://some-random-api.ml/img/birb"
		);
		pages.push(lol.link);
		const { helpme } = await request.get(
			"https://some-random-api.ml/img/fox"
		);
		pages.push(helpme.link);
		const { wtf } = await request.get(
			"https://some-random-api.ml/img/koala"
		);
		pages.push(wtf.link);

		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setFooter(`Page ${page} of ${pages.length}`)
			.setImage(pages[page - 1]);

		msg.say(embed).then((message) => {
			message.react("⏪").then((ra) => {
				message.react("⏩");

				const backwardsFilter = (reaction, user) =>
					reaction.emoji.name === "⏪" &&
					user.id === msg.author.id;
				const forwardsFilter = (reaction, user) =>
					reaction.emoji.name === "⏩" &&
					user.id === msg.author.id;

				const backwards = message.createReactionCollector(
					backwardsFilter,
					{ time: 60000 }
				);
				const forwards = message.createReactionCollector(
					forwardsFilter,
					{ time: 60000 }
				);

				backwards.on("collect", (r) => {
					if (page === 1) return;
					page--;
					embed.setDescription(pages[page - 1]);
					embed.setFooter(
						`Page ${page} of ${pages.length}`
					);
					msg.edit(embed);
				});

				forwards.on("collect", (r) => {
					if (page === pages.length) return;
					page++;
					embed.setDescription(pages[page - 1]);
					embed.setFooter(
						`Page ${page} of ${pages.length}`
					);
					msg.edit(embed);
				});
			});
		});
	}
	async req(url) {
		const { body } = await request.get(url);
		return body.url || body.link;
	}
};
