import { readdir } from "fs/promises";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Event } from "./types";
import { Knub } from "knub";
import { FNBPlugin } from "./plugins/FNB/FNBPlugin";
import { getGuildConfig } from "./guildConfigs";

// Check for required environment variables
const requiredEnvVars = ["ENVIRONMENT", "CLIENT_ID", "BOT_TOKEN", "SLASH_GUILD_ID", "COOLDOWN_API_KEY"];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Set up event handling
export const events = new Collection<string, Event>();
const eventFiles = await readdir("./events");
eventFiles.forEach(async eventFile => {
  const event: Event = (await import(`./events/${eventFile}`)).default;
  events.set(event.name, event);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
});

const knub = new Knub(client, {
  guildPlugins: [FNBPlugin],
  options: {
    autoRegisterApplicationCommands: false,
    getConfig: id => getGuildConfig(id),
  },
});

knub.initialize();
client.login(process.env.BOT_TOKEN);
