const Cooldowns = require('../../db/models/cooldown');
const HumanizeDuration = require('humanize-duration');
const moment = require('moment');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "portal_view",
    permissions: ["BAN_MEMBERS"],
    public: true,
    enabled: true,
    async execute(interaction, args) {

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
            userId: args[0],
            command: "portal_post"
        });

        // If no query is found
        if (!query) return interaction.reply({ content: `No Portal Experience Sharing cooldown found for user **${args[1]}** (${args[0]}).` });

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
            .setTitle(`Portal Experience Sharing cooldown for ${args[1]} (${args[0]})`)
            .setFooter("Click on 'Clear Cooldown' to clear this user's cooldown.")
            .addFields(
                { name: "Cooldown initiated", value: `${HumanizeDuration(query.commandUsedTimestamp - now, { round: true })} ago\nOn ${cooldownStartTimestamp}` },
                { name: "Cooldown ends", value: `In ${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true })}\nOn ${cooldownEndTimestamp}` },
                { name: "Message content", value: `Name: ${query.cooldownMessage.Name}\nDescription: ${query.cooldownMessage.Description}\nExperience Code: ${query.cooldownMessage.Experience_Code}` }
            )

        const responseMsg = await interaction.reply({ embeds: [cooldownViewEmbed], components: [row], fetchReply: true });

        const clearCooldownFilter = i => i.user.id === interaction.user.id; // Only the interaction user
        const collector = responseMsg.createMessageComponentCollector({ filter: clearCooldownFilter, time: 30000, max: 1 });

        // On collect, remove cooldown query from DB. Update response and remove button.
        collector.on("collect", async i => {
            if (i.customId === 'clearCooldown') {
                query.remove();
                i.update({ embeds: [cooldownViewEmbed.setDescription(`**__✅ COOLDOWN CLEARED BY ${i.user.tag} ✅__**`).setFooter("Cooldown cleared.")], components: [] });
                console.log(`${i.user.tag} (${i.user.id}) cleared ${args[1]}'s (${args[0]}) Portal Experience Sharing cooldown`);
            }
        })

        // On collector end: If no collections, remove button and footer.
        collector.on("end", collected => {
            if (collected.size === 0) return interaction.editReply({ embeds: [cooldownViewEmbed.setFooter("")], components: [] });
        })
    }
};