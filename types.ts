import type {
  ChatInputCommandInteraction,
  Client,
  ContextMenuCommandInteraction,
  PermissionResolvable,
  Snowflake,
} from "discord.js";

declare module "bun" {
  interface Env {
    ENVIRONMENT: "dev" | "live";
    CLIENT_ID: string;
    BOT_TOKEN: string;
    SLASH_GUILD_ID: string;
    COOLDOWN_API_KEY: string;
  }
}

// TODO: Give same treatment as Command<T>
export type Event = {
  name: string;
  once?: boolean;
  execute: (client: Client, ...args: any[]) => void;
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
