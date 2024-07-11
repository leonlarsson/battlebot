import { readdir } from "node:fs/promises";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Command, Event } from "#types.js";

// Check for required environment variables
const requiredEnvVars = [
  "ENVIRONMENT",
  "CLIENT_ID",
  "BOT_TOKEN",
  "SLASH_GUILD_ID",
  "COOLDOWN_API_KEY",
  "OPENAI_API_KEY",
  "DATABASE_HOST",
  "DATABASE_USERNAME",
  "DATABASE_PASSWORD",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Set up event handling
export const [events, commands] = await Promise.all([loadEvents(), loadCommands()]);

// Start bot
client.login(process.env.BOT_TOKEN);

async function loadEvents(): Promise<Collection<string, Event<any>>> {
  const events = new Collection<string, Event<any>>();

  const eventFiles = (await readdir("./dist/events")).filter((file) => file.endsWith(".js"));
  eventFiles.forEach(async (eventFile) => {
    const event: Event<any> = (await import(`./events/${eventFile}`)).default;
    events.set(event.name, event);
    if (event.once) {
      client.once(event.name, (args) => event.execute(args));
    } else {
      client.on(event.name, (args) => event.execute(args));
    }
  });

  return events;
}

async function loadCommands(): Promise<Collection<string, Command<any>>> {
  const commands = new Collection<string, Command<any>>();

  const commandFiles = (await readdir("./dist/commands", { recursive: true })).filter((file) => file.endsWith(".js"));
  commandFiles.forEach(async (commandFile) => {
    const command: Command<any> = (await import(`./commands/${commandFile}`)).default;
    commands.set(command.name, command);
  });

  return commands;
}
