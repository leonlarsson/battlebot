import { MessageEmbed, MessageActionRow, MessageButton, Permissions } from "discord.js";
import HumanizeDuration from "humanize-duration";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"
dayjs.extend(utc);
import Cooldowns from "../../db/models/cooldown.js";

export const name = "recruitment_cooldown";
export const permissions = [Permissions.FLAGS.BAN_MEMBERS];
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

    const targetUser = interaction.options.getUser("user");

    const now = new Date().getTime();

    // Get all queries and remove the expired cooldowns
    const allQueries = await Cooldowns.find({});
    allQueries.forEach(query => {
        if (query.cooldownEndsAtTimestamp < now) {
            query.remove();
        }
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
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId("setLongCooldown")
                .setEmoji("⚠")
                .setLabel("Set Cooldown To Year 9999")
                .setStyle('PRIMARY')
        );

    const cooldownViewEmbed = new MessageEmbed()
        .setTitle(`Recruitment cooldown for ${targetUser.tag} (${targetUser.id})`)
        .setFooter({ text: "Click on 'Clear Cooldown' to clear this user's cooldown." })
        .addFields(
            { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
            { name: "Cooldown ends", value: `In ${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true })}\nOn ${cooldownEndTimestamp}` }
        );

    const responseMsg = await interaction.reply({ embeds: [cooldownViewEmbed], components: [row], fetchReply: true });

    const clearCooldownFilter = i => i.user.id === interaction.user.id; // Only the interaction user
    const collector = responseMsg.createMessageComponentCollector({ filter: clearCooldownFilter, time: 30000, max: 1 });

    // On collect, remove cooldown query from DB. Update response and remove button. setLongCooldown sets cooldown to year 9999
    collector.on("collect", async i => {
        if (i.customId === "clearCooldown") {
            query.remove();
            i.update({ embeds: [cooldownViewEmbed.setDescription(`**__✅ COOLDOWN CLEARED BY ${i.user.tag} ✅__**`).setFooter({ text: "Cooldown cleared." })], components: [] });
            console.log(`${i.user.tag} (${i.user.id}) cleared ${targetUser.tag}'s (${targetUser.id}) recruitment cooldown.`);
        }

        if (i.customId === "setLongCooldown") {
            // Set the new timestamp
            await query.updateOne({ cooldownEndsAtTimestamp: 253370764800000, cooldownEndsDate: new Date(253370764800000) });

            // Update embed
            const newEmbed = cooldownViewEmbed
                .setDescription(`**__✅ COOLDOWN SET TO YEAR 9999 BY ${i.user.tag} ✅__**`)
                .setFooter({ text: "Cooldown increased (a lot)." })
                .setFields(
                    { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
                    { name: "Cooldown ends (updated)", value: `In ${HumanizeDuration(253370764800000 - now, { round: true })}\nOn ${dayjs.utc(253370764800000).format("dddd, D MMM YYYY, hh:mm A UTC")}` }
                );

            i.update({ embeds: [newEmbed], components: [] });
            console.log(`${i.user.tag} (${i.user.id}) set ${targetUser.tag}'s (${targetUser.id}) recruitment cooldown to year 9999.`);
        }
    });

    // On collector end: If no collections, remove button and footer.
    collector.on("end", collected => {
        if (collected.size === 0)
            return interaction.editReply({ embeds: [cooldownViewEmbed.setFooter({ text: "" })], components: [] });
    });
}