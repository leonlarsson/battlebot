import type { Client, PermissionResolvable, Snowflake } from "discord.js";

declare module "bun" {
  interface Env {
    ENVIRONMENT: "dev" | "live";
    CLIENT_ID: string;
    BOT_TOKEN: string;
    SLASH_GUILD_ID: string;
    COOLDOWN_API_KEY: string;
  }
}

export type Event = {
  name: string;
  once?: boolean;
  execute: (client: Client, ...args: any[]) => void;
};

export type Command = {
  name: string;
  cooldown?: number;
  enabled: boolean;
  isPublic: boolean;
  requiredPermissions?: PermissionResolvable[];
  allowedChannels?: Snowflake[];
  wrongChannelReply?: string;
  execute: (client: Client, ...args: any[]) => void;
};
