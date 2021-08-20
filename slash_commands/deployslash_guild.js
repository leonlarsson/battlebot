const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config');
const slashCommandsData = require('./slash_commands_data');

// Set vars
const botToken = config.botToken;
const clientId = config.clientId;

// Guild id to deploy in
const guildId = '140933721929940992'; // BFD

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