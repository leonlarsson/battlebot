// eslint-disable-next-line no-unused-vars
import { ChatInputCommandInteraction, ComponentType, ButtonStyle, PermissionFlagsBits } from "discord.js";
import HumanizeDuration from "humanize-duration";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"
import Cooldowns from "../../db/models/cooldown.js";
dayjs.extend(utc);

export const name = "portal_cooldown";
export const permissions = PermissionFlagsBits.BanMembers;
export const isPublic = true;
export const enabled = true;
/**
 * @param {ChatInputCommandInteraction} interaction The interaction.
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
        command: "portal_post"
    });

    // If no query is found
    if (!query)
        return interaction.reply({ content: `No Portal Experience sharing cooldown found for user **${targetUser.tag}** (${targetUser.id}).` });

    // Build day.js
    const cooldownStartTimestamp = dayjs.utc(query.commandUsedTimestamp).format("dddd, D MMM YYYY, hh:mm A UTC");
    const cooldownEndTimestamp = dayjs.utc(query.cooldownEndsAtTimestamp).format("dddd, D MMM YYYY, hh:mm A UTC");

    const row = {
        type: ComponentType.ActionRow,
        components: [
            {
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                label: "Clear Cooldown",
                custom_id: "clearCooldown"
            },
            {
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                label: "Set Cooldown To Year 9999",
                emoji: "⚠",
                custom_id: "setLongCooldown"
            }
        ]
    };

    const cooldownViewEmbed = {
        title: `Portal Experience sharing cooldown for ${targetUser.tag} (${targetUser.id})`,
        footer: { text: "Click on 'Clear Cooldown' to clear this user's cooldown." },
        fields: [
            { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
            { name: "Cooldown ends", value: `In ${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true })}\nOn ${cooldownEndTimestamp}` }
        ]
    };

    const responseMsg = await interaction.reply({ embeds: [cooldownViewEmbed], components: [row], fetchReply: true });

    const clearCooldownFilter = i => i.user.id === interaction.user.id;
    responseMsg.awaitMessageComponent({ filter: clearCooldownFilter, time: 30000, componentType: ComponentType.Button })
        .then(async buttonInteraction => {

            // On collect, remove cooldown query from DB. Update response and remove button. setLongCooldown sets cooldown to year 9999
            if (buttonInteraction.customId === "clearCooldown") {
                query.remove();
                buttonInteraction.update({ embeds: [{ ...cooldownViewEmbed, description: `**__✅ COOLDOWN CLEARED BY ${buttonInteraction.user.tag} ✅__**`, footer: { text: "Cooldown cleared." } }], components: [] });
                console.log(`${buttonInteraction.user.tag} (${buttonInteraction.user.id}) cleared ${targetUser.tag}'s (${targetUser.id}) Portal Experience sharing cooldown.`);
            }

            if (buttonInteraction.customId === "setLongCooldown") {
                // Set the new timestamp
                await query.updateOne({ cooldownEndsAtTimestamp: 253370764800000, cooldownEndsDate: new Date(253370764800000) });

                // Update embed
                const newEmbed = {
                    ...cooldownViewEmbed,
                    description: `**__✅ COOLDOWN SET TO YEAR 9999 BY ${buttonInteraction.user.tag} ✅__**`,
                    footer: { text: "Cooldown increased (a lot)." },
                    field: [
                        { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
                        { name: "Cooldown ends (updated)", value: `In ${HumanizeDuration(253370764800000 - now, { round: true })}\nOn ${dayjs.utc(253370764800000).format("dddd, D MMM YYYY, hh:mm A UTC")}` }
                    ]
                }

                buttonInteraction.update({ embeds: [newEmbed], components: [] });
                console.log(`${buttonInteraction.user.tag} (${buttonInteraction.user.id}) set ${targetUser.tag}'s (${targetUser.id}) Portal Experience sharing cooldown to year 9999.`);
            }
        }).catch(() => {
            interaction.editReply({ embeds: [{ ...cooldownViewEmbed, footer: { text: "" } }], components: [] });
        });
}