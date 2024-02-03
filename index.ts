import { readdir } from "fs/promises";
import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  ContextMenuCommandInteraction,
  GatewayIntentBits,
} from "discord.js";
import type { Command, Event } from "./types";
// import type { Command, ContextMenuCommand, Event, SlashCommand } from "./types";

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

type CommandTypes = Command<ChatInputCommandInteraction | ContextMenuCommandInteraction>;
export const commands = new Collection<string, CommandTypes>();
const commandFiles = (await readdir("./commands", { recursive: true })).filter(file => file.endsWith(".ts"));
commandFiles.forEach(async commandFile => {
  const command: CommandTypes = (await import(`./commands/${commandFile}`)).default;
  commands.set(command.name, command);
});

client.login(process.env.BOT_TOKEN);
