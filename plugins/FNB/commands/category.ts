import type { GuildMember } from "discord.js";
import { guildPluginSlashCommand, slashOptions } from "knub";
import { activateFNB, deactivateFNB } from "@/utils/moveFNBCategory";

export default guildPluginSlashCommand({
  name: "category",
  description: "[ADMIN] Manually activate or deactivate the FNB category. Use only if the automated one fails.",
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
    // Set allowed roles. FNB Staff & Admin (on BFD)
    const allowedRoles = ["907750002313539634", "140941611415633920"];

    if (
      !allowedRoles.some(r => (interaction.member as GuildMember | null)?.roles.cache.has(r)) &&
      interaction.user.id !== "99182302885588992"
    ) {
      interaction.reply({
        content: "You can't use this.",
        ephemeral: true,
      });
      return;
    }

    if (options.action === "activate") {
      activateFNB(interaction.client, interaction);
    } else {
      deactivateFNB(interaction.client, interaction);
    }
  },
});
