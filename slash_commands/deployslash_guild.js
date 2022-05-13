import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as config from "../config.js";
import slashCommandsData from "./slash_commands_data.js";

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
    throw new Error('No environment variable found! Please set config.environment to "live" or "dev"!');
}

const rest = new REST({ version: '9' }).setToken(botToken);

(async () => {
    try {
        console.log(`Attempting to deploy Slash Commands on guild ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: slashCommandsData }
        );

        console.log(`Successfully deployed Slash Commands on guild ${guildId}.`);
    } catch (error) {
        console.error(error);
    }
})();