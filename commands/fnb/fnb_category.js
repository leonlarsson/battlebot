// eslint-disable-next-line no-unused-vars
import { ChatInputCommandInteraction } from "discord.js";
import { activateFNB, deactivateFNB } from "../../utils/moveFNBCategory.js";

export const name = "fnb_category";
export const isPublic = true;
export const enabled = true;
/**
 * @param {ChatInputCommandInteraction} interaction The interaction.
 */
export function execute(interaction) {

    // Set allowed roles. FNB Staff & Admin (on BFD)
    const allowedRoles = ["907750002313539634", "140941611415633920"];
    if (!allowedRoles.some(r => interaction.member.roles.cache.has(r)) && interaction.user.id !== "99182302885588992")
        return interaction.reply({ content: "You can't use this.", ephemeral: true });

    if (interaction.options.getString("action") === "activate") {
        activateFNB(interaction.client, interaction);
    } else {
        deactivateFNB(interaction.client, interaction);
    }

}