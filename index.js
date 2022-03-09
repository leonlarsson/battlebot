import { readdirSync } from "fs";
import { Client, Intents, Collection } from "discord.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
import mongoose from "mongoose";
import * as config from "./config.js";

let botToken;
if (config.environment === "live") {
	botToken = config.botToken;
} else if (config.environment === "dev") {
	botToken = config.botToken_dev;
} else {
	console.log("No environment specified.");
}

// Events
client.events = new Collection();
const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	(async () => {
		const event = await import(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	})();
}

// Commands
client.commands = new Collection();
const commandFolders = readdirSync("./commands");

for (const folder of commandFolders) {
	const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		(async () => {
			const command = await import(`./commands/${folder}/${file}`);
			client.commands.set(command.name, command);
		})();
	}
}

// Error handling (bad)
process.on('unhandledRejection', error => {
	if (error.code == 10008) {
		console.error(`${error}: ERROR HANDLER - Unknown message. Was the message deleted?`);
	} else if (error.code == 50001) {
		console.error(`${error}: ERROR HANDLER - Missing access. Did the bot lose access to a channel?`);
	} else if (error.code == 50013) {
		console.error(`${error}: ERROR HANDLER - Missing permissions. Missing a permission somewhere.`);
	} else {
		console.trace(`${error}: ERROR HANDLER - Something broke.`);
	}
});

// Connect to DB
mongoose.connect(config.mongoDB_srv)
	.then(() => {
		console.log("Connected to the DB.");
	}).catch(error => {
		console.log(error);
	})

console.log(`Attempting to log in - Environment: ${config.environment}`);
client.login(botToken);