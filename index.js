const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config');

let botToken;
if (config.environment === "dev") {
	botToken = config.botToken_dev;
} else if (config.environment === "live") {
	botToken = config.botToken;
} else {
	console.log("No environment specified.");
}

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

mongoose.connect(config.mongoDB_srv, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log("Connected to the DB.");
}).catch(error => {
	console.log(error);
})

client.login(botToken);