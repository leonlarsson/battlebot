const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config');

// Set vars
const botToken = config.botToken;
const clientId = config.clientId;

// Guild id to deploy in
const guildId = '140933721929940992'; // BFD

const rest = new REST({ version: '9' }).setToken(botToken);

(async () => {
    try {
        console.log(`Attempting to remove Slash Commands on guild ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: [] },
        );

        console.log(`Successfully removed Slash Commands on guild ${guildId}.`);
    } catch (error) {
        console.error(error);
    }
})();