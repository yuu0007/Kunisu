const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const { Intents, MessageEmbed, WebhookClient } = require('discord.js');
const { Database } = require('quickmongo');
const BOATS = require('boats.js');
const logs = require('discord-logs');
const path = require('path');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const http = require('http');
const config = require('./config.json');

const client = new CommandoClient({
	commandPrefix: config.prefix,
	owner: config.owner,
	partials: ['MESSAGE', 'REACTION'],
	ws: { intents: Intents.ALL },
	disableMentions: 'everyone'
});

const Boats = new BOATS(config.boats);

const db = new Database(config.mongodb);

const server = http.createServer((req, res) => {
	res.end('hello');
});
server.listen(8080);

logs(client);

client.db = db;

client.config = config;

client.boats = Boats;

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['anime', 'Anime'],
		['util', 'Utility'],
		['commands', 'Commands'],
		['logs', 'Logging']
	])
	.registerDefaultCommands({
		unknownCommand: false,
		ping: false,
		eval: false,
		help: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	console.log(`${client.user.tag} (${client.user.id}) | Ready!`);
	client.user.setActivity(
		`over ${client.guilds.cache
			.reduce((a, b) => a + b.memberCount, 0)
			.toLocaleString()} people`,
		{ type: 'WATCHING' }
	);
	Boats.postStats(client.guilds.cache.size, client.user.id)
		.then(() => {
			console.log('Successfully updated server count.');
		})
		.catch(err => {
			console.error(err);
		});
});

client.on('voiceChannelJoin', async (member, channel) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`${member.user.tag} (${
					member.user.id
				}) just joined the voice channel <#${channel.id}>.`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on('voiceChannelLeave', async (member, channel) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`${member.user.tag} (${member.user.id}) just left the voice channel <#${
					channel.id
				}>.`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on('voiceChannelSwitch', async (member, oldChannel, newChannel) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`${member.user.tag} (${member.user.id}) just left the voice channel <#${
					oldChannel.id
				}> and joined the voice channel <#${newChannel.id}>.`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on('voiceChannelMute', async (member, muteType) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`${member.user.tag} (${
					member.user.id
				}) just became ${muteType} in a voice channel!`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client.on('voiceChannelUnmute', async (member, oldMuteType) => {
	const id = await db.get(`modid_${member.guild.id}`);
	const token = await db.get(`modtoken_${member.guild.id}`);
	if (token && id) {
		const webhook = new WebhookClient(id, token);
		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`${member.user.tag} (${
					member.user.id
				}) just got unmuted! (${oldMuteType})`
			)
			.setTimestamp();
		webhook.send(embed);
	}
});

client
	.setProvider(
		sqlite
			.open({ filename: 'database.db', driver: sqlite3.Database })
			.then(db => new SQLiteProvider(db))
	)
	.catch(console.error);

client.login(config.token);

db.on('ready', async () => {
	const ping = await db.fetchLatency();
	console.log('MongoDB is ready!');
	console.log(`${Math.round(ping.average)} ms`);
});

setInterval(() => {
	require('node-superfetch').get('https://kunisubot.yuu0007.repl.co');
}, 180000);