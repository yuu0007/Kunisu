const { Command } = require("discord.js-commando");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "modlogs",
			aliases: ["ml"],
			memberName: "modlogs",
			group: "logs",
			guildOnly: true,
			userPermissions: ["MANAGE_CHANNELS"],
			clientPermissions: ["MANAGE_WEBHOOKS"],
			description:
				"Sets the mod logs channel for the server.",
			args: [
				{
					key: "channel",
					prompt:
						"In which channel do you want to set mod logs in?",
					type: "text-channel",
				},
			],
		});
	}

	run(msg, { channel }) {
		channel.createWebhook("Kunisu", {
			avatar: this.client.user.displayAvatarURL({
				size: 4096,
			}),
			reason: "Mod-Logs",
		}).then(async (hook) => {
			await this.client.db.set(
				`modtoken_${msg.guild.id}`,
				hook.token
			);
			await this.client.db.set(
				`modid_${msg.guild.id}`,
				hook.id
			);
		});
		msg.embed({
			description: `Successfully set the mod logs channel to <#${channel.id}>!`,
			color: "RANDOM",
		});
	}
};
