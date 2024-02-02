import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(
      `Attempting to remove Slash Commands on guild ${process.env.SLASH_GUILD_ID}.`,
    );

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID ?? "",
        process.env.SLASH_GUILD_ID,
      ),
      { body: [] },
    );

    console.log(
      `Successfully removed Slash Commands on guild ${process.env.SLASH_GUILD_ID}.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
