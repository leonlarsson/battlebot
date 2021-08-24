const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config');
const slashCommandsData = require('./slash_commands_data');

let botToken;
let clientId;
let guildId;
if (config.environment === "live") {
    botToken = config.botToken;
    clientId = config.clientId;
    guildId = config.slashGuild;
} else if (config.environment === "dev") {
    botToken = config.botToken_dev;
    clientId = config.clientId_dev;
    guildId = config.slashGuild_dev;
} else {
    console.log("No environment specified.");
}

const rest = new REST({ version: '9' }).setToken(botToken);

(async () => {
    try {
        console.log(`Attempting to deploy Slash Commands on guild ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: slashCommandsData },
        );

        console.log(`Successfully deployed Slash Commands on guild ${guildId}.`);
    } catch (error) {
        console.error(error);
    }
})();