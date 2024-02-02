import { guildPluginSlashGroup } from "knub";
import info from "./info";
import category from "./category";

export default guildPluginSlashGroup({
  name: "fnb",
  description: "Commands related to #FridayNightBattlefield.",
  subcommands: [info, category],
});
