import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import * as config from "../config.js";

let clientId;
let guildId;
if (process.env.ENVIRONMENT === "live") {
    clientId = config.clientId;
    guildId = config.slashGuild;
} else if (process.env.ENVIRONMENT === "dev") {
    clientId = config.clientId_dev;
    guildId = config.slashGuild_dev;
} else {
    throw new Error('No environment variable found! Please set process.env.ENVIRONMENT to "live" or "dev"!');
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`Attempting to remove Slash Commands on guild ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: [] }
        );

        console.log(`Successfully removed Slash Commands on guild ${guildId}.`);
    } catch (error) {
        console.error(error);
    }
})();