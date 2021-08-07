const fs = require('fs');
const Discord = require('discord.js');
const { botToken } = require('./config');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
client.events = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

// Events
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

process.on('unhandledRejection', error => {
	if (error.code == 10008) {
		console.error(`${error}: ERROR HANDLER - Unknown message. Was the message deleted?`)
	} else if (error.code == 50001) {
		console.error(`${error}: ERROR HANDLER - Missing access. Did the bot lose access to a channel?`)
	} else if (error.code == 50013) {
		console.error(`${error}: ERROR HANDLER - Missing permissions. Missing a permission somewhere.`)
	} else {
		console.trace(`${error}: ERROR HANDLER - Something broke.`)
	}
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.login(botToken)