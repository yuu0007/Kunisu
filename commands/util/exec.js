const { Command } = require("discord.js-commando");
const { execSync } = require("child_process");
const { stripIndents } = require("common-tags");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "exec",
			aliases: ["execute", "$"],
			aliases: ["execute", "$", "sh"],
			group: "util",
			memberName: "exec",
			description: "Executes a command-line application.",
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: "command",
					prompt:
						"What command do you want to execute?",
					type: "string",
				},
			],
		});
	}

	async run(msg, { command }) {
		const results = await this.exec(command);
		return msg.reply(stripIndents`
			_${results.err ? "An error occurred:" : "Successfully executed."}_
			\`\`\`sh
			${
				results.std.length > 2000
					? `${results.std.substring(0, 1991)}...`
					: results.std
			}
			\`\`\`
		`);
	}

	async exec(command) {
		try {
			const stdout = await execSync(command, {
				timeout: 30000,
				encoding: "utf8",
			});
			return { err: false, std: stdout.trim() };
		} catch (err) {
			return { err: true, std: err.stderr.trim() };
		}
	}
};
