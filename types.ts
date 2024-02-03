import type { ClientEvents, PermissionResolvable, Snowflake } from "discord.js";

declare module "bun" {
  interface Env {
    ENVIRONMENT: "dev" | "live";
    CLIENT_ID: string;
    BOT_TOKEN: string;
    SLASH_GUILD_ID: string;
    COOLDOWN_API_KEY: string;
  }
}

export type Event<TEventName extends keyof ClientEvents> = {
  name: TEventName;
  once?: boolean;
  execute: (...props: ClientEvents[TEventName]) => void;
};

export type Command<InteractionType> = {
  name: string;
  cooldown?: number;
  enabled: boolean;
  isPublic: boolean;
  requiredPermissions?: PermissionResolvable[];
  allowedChannels?: Snowflake[];
  wrongChannelReply?: string;
  allowedRoles?: Snowflake[];
  allowedUsers?: Snowflake[];
  execute: (interaction: InteractionType) => void;
};
