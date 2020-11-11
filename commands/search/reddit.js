const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const Reddit = require("@cxllm/reddit");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "reddit",
			aliases: ["r"],
			group: "search",
			memberName: "reddit",
			description: "Gets a random image from a subreddit.",
			args: [
				{
					key: "subreddit",
					prompt:
						"Which subreddit do you want to get an image from?",
					type: "string",
				},
			],
		});
	}

	async run(msg, { subreddit }) {
		const m = await msg.embed({
			description: "Fetching the image...",
		});
		const data = await Reddit.random(subreddit).catch(() => {
			const emb = new MessageEmbed().setDescription(
				"That subreddit doesn't exist..."
			);
			return m.edit(emb);
		});
		if (data.nsfw && !msg.channel.nsfw) {
			const embe = new MessageEmbed().setDescription(
				"The content has NSFW Content..."
			);
			return m.edit(embe);
		}
		if (data.video) {
			const em = new MessageEmbed().setDescription(
				"The content has a video, so therefore it cannot be shown..."
			);
			return m.edit(em);
		}
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle(data.title)
			.setImage(data.image)
			.setDescription(
				`Posted by ${data.author} | ${data.upvotes} 👍 and ${data.downvotes} 👎`
			)
			.setURL(data.url)
			.setFooter(
				`Requested by ${msg.author.tag}`,
				msg.author.displayAvatarURL({
					dynamic: true,
					size: 4096,
				})
			);
		return m.edit(embed);
	}
};
