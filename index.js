const {
	CommandoClient,
	SQLiteProvider,
	FriendlyError,
} = require("discord.js-commando");
const { Intents, MessageEmbed, WebhookClient } = require("discord.js");
const { Database } = require("quickmongo");
const logs = require("discord-logs");
const path = require("path");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const http = require("http");
const config = require("./config.json");

const client = new CommandoClient({
	commandPrefix: config.prefix,
	owner: config.owner,
	partials: ["MESSAGE", "REACTION"],
	ws: {
		intents: Intents.ALL,
		properties: { $browser: "Discord Android" },
	},
	disableMentions: "everyone",
});

const db = new Database(config.mongodb);

const server = http.createServer((req, res) => {
	res.end("hello");
});
server.listen(8080);

logs(client);

client.db = db;

client.config = config;

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, "types"))
	.registerGroups([
		["anime", "Anime"],
		["util", "Utility"],
		["commands", "Commands"],
		["logs", "Logging"],
		["nsfw", "NSFW"],
	])
	.registerDefaultCommands({
		unknownCommand: false,
		ping: false,
		eval: false,
		help: false,
	})
	.registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
	console.log(`${client.user.tag} (${client.user.id}) | Ready!`);
	client.user.setActivity(
		`over ${client.guilds.cache
			.reduce((a, b) => a + b.memberCount, 0)
			.toLocaleString()} people`,
		{ type: "WATCHING" }
	);
});

client.on("voiceChannelJoin", async (member, channel) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${member.user.tag} (${member.user.id}) just joined the voice channel <#${channel.id}>.`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on("voiceChannelLeave", async (member, channel) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${member.user.tag} (${member.user.id}) just left the voice channel <#${channel.id}>.`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${member.user.tag} (${member.user.id}) just left the voice channel <#${oldChannel.id}> and joined the voice channel <#${newChannel.id}>.`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on("voiceChannelMute", async (member, muteType) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${member.user.tag} (${member.user.id}) just became ${muteType} in a voice channel!`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on("voiceChannelUnmute", async (member, oldMuteType) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${member.user.tag} (${member.user.id}) just got unmuted! (${oldMuteType})`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on("debug", console.log);

client.on("error", console.error);

client.on("warn", console.warn);

client.on("disconnect", () => {
	console.log("Disconnected...");
});

client.on("reconnecting", () => {
	console.log("Reconnecting...");
});

client.on("commandError", (cmd, err) => {
	if (err instanceof FriendlyError) return;
	console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
});

client.setProvider(
	sqlite
		.open({ filename: "database.db", driver: sqlite3.Database })
		.then((sq) => new SQLiteProvider(sq))
).catch(console.error);

client.login(config.token);

db.on("ready", async () => {
	const ping = await db.fetchLatency();
	console.log("MongoDB is ready!");
	console.log(`${Math.round(ping.average)} ms`);
});
