const Cooldowns = require('../../db/models/cooldown');
const HumanizeDuration = require('humanize-duration');
const moment = require('moment');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "portal_cooldown",
    permissions: ["BAN_MEMBERS"],
    public: true,
    enabled: true,
    async execute(interaction) {

        const targetUser = interaction.options.getUser("user");

        const now = new Date().getTime();

        // Get all queries and remove the expired cooldowns
        const allQueries = await Cooldowns.find({});
        allQueries.forEach(query => {
            if (query.cooldownEndsAtTimestamp < now) {
                query.remove();
            }
        })

        // Find cooldown for user
        const query = await Cooldowns.findOne({
            userId: targetUser.id,
            command: "portal_post"
        });

        // If no query is found
        if (!query) return interaction.reply({ content: `No Portal Experience sharing cooldown found for user **${targetUser.tag}** (${targetUser.id}).` });

        // Build moments
        const cooldownStartTimestamp = moment.utc(query.commandUsedTimestamp).format("dddd, D MMM Y, hh:mm:ss A (UTC)");
        const cooldownEndTimestamp = moment.utc(query.cooldownEndsAtTimestamp).format("dddd, D MMM Y, hh:mm:ss A (UTC)");

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("clearCooldown")
                    .setLabel("Clear Cooldown")
                    .setStyle('PRIMARY')
            )

        const cooldownViewEmbed = new MessageEmbed()
            .setTitle(`Portal Experience sharing cooldown for ${targetUser.tag} (${targetUser.id}).`)
            .setFooter("Click on 'Clear Cooldown' to clear this user's cooldown.")
            .addFields(
                { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
                { name: "Cooldown ends", value: `In ${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true })}\nOn ${cooldownEndTimestamp}` }
            )

        const responseMsg = await interaction.reply({ embeds: [cooldownViewEmbed], components: [row], fetchReply: true });

        const clearCooldownFilter = i => i.user.id === interaction.user.id; // Only the interaction user
        const collector = responseMsg.createMessageComponentCollector({ filter: clearCooldownFilter, time: 30000, max: 1 });

        // On collect, remove cooldown query from DB. Update response and remove button.
        collector.on("collect", async i => {
            if (i.customId === 'clearCooldown') {
                query.remove();
                i.update({ embeds: [cooldownViewEmbed.setDescription(`**__✅ COOLDOWN CLEARED BY ${i.user.tag} ✅__**`).setFooter("Cooldown cleared.")], components: [] });
                console.log(`${i.user.tag} (${i.user.id}) cleared ${targetUser.tag}'s (${targetUser.id}) Portal Experience sharing cooldown.`);
            }
        })

        // On collector end: If no collections, remove button and footer.
        collector.on("end", collected => {
            if (collected.size === 0) return interaction.editReply({ embeds: [cooldownViewEmbed.setFooter("")], components: [] });
        })
    }
};