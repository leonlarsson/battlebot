import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { slashGuild, slashGuild_dev } from "../config.js";
import "dotenv/config";
import slashCommandsData from "./slash_commands_data.js";

const guildId = process.env.ENVIRONMENT === "live" ? slashGuild : slashGuild_dev;

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`Attempting to deploy Slash Commands on guild ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: slashCommandsData }
        );

        console.log(`Successfully deployed Slash Commands on guild ${guildId}.`);
    } catch (error) {
        console.error(error);
    }
})();