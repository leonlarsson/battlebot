// eslint-disable-next-line no-unused-vars
import { Client, CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { ButtonStyle } from "discord-api-types/v9";
import { createFNBEvent } from "../../utils/createFNBEvent.js";

export const name = "fnb_create_event";
export const isPublic = true;
export const enabled = true;
/**
 * @param {CommandInteraction} interaction The interaction.
 * @param {Client} client The client.
 */
export async function execute(interaction, client) {

    // Set allowed roles. FNB Staff & Admin (on BFD)
    const allowedRoles = ["907750002313539634", "140941611415633920"];
    if (!allowedRoles.some(r => interaction.member.roles.cache.has(r)) && interaction.user.id !== "99182302885588992")
        return interaction.reply({ content: "You can't use this.", ephemeral: true });

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel("Yes, create event")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("create"),
            new MessageButton()
                .setLabel("No, cancel")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("cancel")
        );

    const responseMsg = await interaction.reply({ content: "Are you sure you want to create an FNB event?\n**Note:** Only create an event if the automatic process fails.", components: [row], fetchReply: true });

    const filter = i => {
        if (i.user.id === interaction.user.id) return true;
        i.reply({ content: "You can't use this.", ephemeral: true });
        return false;
    }
    const collector = responseMsg.createMessageComponentCollector({ filter, time: 20000, max: 1 });

    collector.on("collect", i => {
        if (i.customId === "create") {
            console.log(`${interaction.user.tag} (${interaction.user.id}) confirmed FNB event-creation.`);
            createFNBEvent(client, interaction);
        }

        if (i.customId === "cancel") {
            return i.update({ content: "Cancelling FNB event-creation.", components: [] });
        }
    });

    collector.on("end", (collected, endReason) => {
        if (collected.size === 0 && endReason === "time") {
            interaction.editReply({ content: "Cancelling FNB event-creation.", components: [] });
        }
    });
}