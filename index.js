const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
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


// Events
client.events = new Discord.Collection();
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Commands
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// Error handling (bad)
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

// Connect to DB
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