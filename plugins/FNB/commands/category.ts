import { guildPluginSlashCommand, slashOptions } from "knub";
import { activateFNB, deactivateFNB } from "@/utils/moveFNBCategory";

export default guildPluginSlashCommand({
  name: "category",
  description: "[ADMIN] Manually activate or deactivate the FNB category. Use only if the automated one fails.",
  configPermission: "can_category",
  signature: [
    slashOptions.string({
      name: "action",
      description: "Whether to deactivate (move down) or activate (move up) the FNB category.",
      required: true,
      choices: [
        {
          name: "Activate (Move up)",
          value: "activate",
        },
        {
          name: "Deactivate (Move down)",
          value: "deactivate",
        },
      ],
    }),
  ],
  run({ interaction, options }) {
    if (options.action === "activate") {
      activateFNB(interaction.client, interaction);
    } else {
      deactivateFNB(interaction.client, interaction);
    }
  },
});
