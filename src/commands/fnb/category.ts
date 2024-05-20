import createCommand from "#utils/createCommand.js";
import { activateFNB, deactivateFNB } from "#utils/moveFNBCategory.js";

export default createCommand({
  name: "fnb_category",
  enabled: true,
  isPublic: true,
  allowedRoles: ["907750002313539634", "140941611415633920", "174949751152836608"], // FNB Staff, Admin, Mod
  execute: interaction => {
    if (interaction.options.getString("action") === "activate") {
      activateFNB(interaction.client, interaction);
    } else {
      deactivateFNB(interaction.client, interaction);
    }
  },
});
