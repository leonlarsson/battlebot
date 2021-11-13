const mongoose = require('mongoose');
const Cooldowns = require('../db/models/cooldown');
const HumanizeDuration = require('humanize-duration');

module.exports = {

    checkCooldown: async (interaction, command) => {

        const now = new Date().getTime();
        const cooldownEnd = (now + command.cooldown);

        if (command.cooldown) {

            // Look for command cooldown for the user
            const query = await Cooldowns.findOne({
                userId: interaction.user.id,
                command: command.name,
            });

            // If a cooldown query exists, check if expired. If expired, update cooldown times. If query does not exist, add one
            if (query) {
                if (query.cooldownEndsAtTimestamp > now) {
                    interaction.reply({ content: `Please wait \`${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true, conjunction: " and " })}\` before using this command again.`, ephemeral: true });
                } else {
                    await query.updateOne({ commandUsedTimestamp: now, commandUsedDate: new Date(now), cooldownEndsAtTimestamp: cooldownEnd, cooldownEndsDate: new Date(cooldownEnd) });
                }
            }

            return query;
        }
    },

    addCooldown: async (interaction, command) => {

        const now = new Date().getTime();
        const cooldownEnd = (now + command.cooldown);
        const cooldown = new Cooldowns({
            _id: mongoose.Types.ObjectId(),
            guildName: interaction.guild.name,
            guildId: interaction.guild.id,
            username: interaction.user.tag,
            userId: interaction.user.id,
            command: command.name,
            commandUsedTimestamp: now,
            commandUsedDate: new Date(now),
            cooldownEndsAtTimestamp: cooldownEnd,
            cooldownEndsDate: new Date(cooldownEnd),
        });

        cooldown.save().catch(err => console.error(err));
    }
}
