import { guildPlugin } from "knub";
import commands from "./commands";

export const FNBPlugin = guildPlugin({
  name: "fnb",
  configParser: e => e,
  slashCommands: [commands],
  defaultOptions: {
    config: {
      can_info: true,
      can_create: false,
      can_category: false,
    },
  },
});
