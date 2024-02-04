import createCommand from "@/utils/createCommand";
import { activateFNB, deactivateFNB } from "@/utils/moveFNBCategory";
import type { ChatInputCommandInteraction } from "discord.js";

export default createCommand<ChatInputCommandInteraction>({
  name: "fnb_category",
  enabled: true,
  isPublic: true,
  allowedRoles: ["907750002313539634", "140941611415633920"], // FNB Staff, Admin
  execute: interaction => {
    if (interaction.options.getString("action") === "activate") {
      activateFNB(interaction.client, interaction);
    } else {
      deactivateFNB(interaction.client, interaction);
    }
  },
});
