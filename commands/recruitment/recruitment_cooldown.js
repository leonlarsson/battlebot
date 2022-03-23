// eslint-disable-next-line no-unused-vars
import { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } from "discord.js";
import { ButtonStyle, PermissionFlagsBits } from "discord-api-types/v9";
import HumanizeDuration from "humanize-duration";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"
import Cooldowns from "../../db/models/cooldown.js";
dayjs.extend(utc);

export const name = "recruitment_cooldown";
export const permissions = PermissionFlagsBits.BanMembers;
export const isPublic = true;
export const enabled = true;
/**
 * @param {CommandInteraction} interaction The interaction.
 */
export async function execute(interaction) {

    const targetUser = interaction.options.getUser("user");

    const now = new Date().getTime();

    // Get all queries and remove the expired cooldowns
    const allQueries = await Cooldowns.find({});
    allQueries.forEach(query => {
        if (query.cooldownEndsAtTimestamp < now) query.remove();
    });

    // Find cooldown for user
    const query = await Cooldowns.findOne({
        userId: targetUser.id,
        command: "recruitment_post"
    });

    // If no query is found
    if (!query)
        return interaction.reply({ content: `No recruitment cooldown found for user **${targetUser.tag}** (${targetUser.id}).` });

    // Build day.js
    const cooldownStartTimestamp = dayjs.utc(query.commandUsedTimestamp).format("dddd, D MMM YYYY, hh:mm A UTC");
    const cooldownEndTimestamp = dayjs.utc(query.cooldownEndsAtTimestamp).format("dddd, D MMM YYYY, hh:mm A UTC");

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("clearCooldown")
                .setLabel("Clear Cooldown")
                .setStyle(ButtonStyle.Primary),
            new MessageButton()
                .setCustomId("setLongCooldown")
                .setEmoji("⚠")
                .setLabel("Set Cooldown To Year 9999")
                .setStyle(ButtonStyle.Primary)
        );

    const cooldownViewEmbed = new MessageEmbed()
        .setTitle(`Recruitment cooldown for ${targetUser.tag} (${targetUser.id})`)
        .setFooter({ text: "Click on 'Clear Cooldown' to clear this user's cooldown." })
        .addFields(
            { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
            { name: "Cooldown ends", value: `In ${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true })}\nOn ${cooldownEndTimestamp}` }
        );

    const responseMsg = await interaction.reply({ embeds: [cooldownViewEmbed], components: [row], fetchReply: true });

    const clearCooldownFilter = i => i.user.id === interaction.user.id;
    responseMsg.awaitMessageComponent({ filter: clearCooldownFilter, time: 30000 })
        .then(async buttonInteraction => {

            // On collect, remove cooldown query from DB. Update response and remove button. setLongCooldown sets cooldown to year 9999
            if (buttonInteraction.customId === "clearCooldown") {
                query.remove();
                buttonInteraction.update({ embeds: [cooldownViewEmbed.setDescription(`**__✅ COOLDOWN CLEARED BY ${buttonInteraction.user.tag} ✅__**`).setFooter({ text: "Cooldown cleared." })], components: [] });
                console.log(`${buttonInteraction.user.tag} (${buttonInteraction.user.id}) cleared ${targetUser.tag}'s (${targetUser.id}) recruitment cooldown.`);
            }

            if (buttonInteraction.customId === "setLongCooldown") {
                // Set the new timestamp
                await query.updateOne({ cooldownEndsAtTimestamp: 253370764800000, cooldownEndsDate: new Date(253370764800000) });

                // Update embed
                const newEmbed = cooldownViewEmbed
                    .setDescription(`**__✅ COOLDOWN SET TO YEAR 9999 BY ${buttonInteraction.user.tag} ✅__**`)
                    .setFooter({ text: "Cooldown increased (a lot)." })
                    .setFields(
                        { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
                        { name: "Cooldown ends (updated)", value: `In ${HumanizeDuration(253370764800000 - now, { round: true })}\nOn ${dayjs.utc(253370764800000).format("dddd, D MMM YYYY, hh:mm A UTC")}` }
                    );

                buttonInteraction.update({ embeds: [newEmbed], components: [] });
                console.log(`${buttonInteraction.user.tag} (${buttonInteraction.user.id}) set ${targetUser.tag}'s (${targetUser.id}) recruitment cooldown to year 9999.`);
            }
        }).catch(() => {
            interaction.editReply({ embeds: [cooldownViewEmbed.setFooter({ text: "" })], components: [] });
        });
}