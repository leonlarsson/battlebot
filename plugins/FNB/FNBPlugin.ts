import { guildPlugin } from "knub";
import commands from "./commands";

export const FNBPlugin = guildPlugin({
  name: "fnb",
  configParser: () => ({}),
  slashCommands: [commands],
});
