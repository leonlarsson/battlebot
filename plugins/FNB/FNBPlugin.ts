import { guildPlugin, type PluginOptions } from "knub";
import commands from "./commands";
import type { FNBPluginType } from "./types";

const defaultOptions: PluginOptions<FNBPluginType> = {
  config: {
    can_info: true,
    can_create: false,
    can_category: false,
  },
};

export const FNBPlugin = guildPlugin({
  name: "fnb",
  configParser: e => e,
  slashCommands: [commands],
  defaultOptions,
});
