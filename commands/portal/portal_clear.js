const Cooldowns = require('../../db/models/cooldown');

module.exports = {
    name: "portal_clear",
    permissions: ["BAN_MEMBERS"],
    public: true,
    enabled: true,
    async execute(interaction, args) {

        const now = new Date().getTime();

        const query = await Cooldowns.findOne({
            userId: args[0],
            command: "portal_post"
        });

        // If query exists, remove and notify. If not, notify.
        if (query) {
            query.remove();
            interaction.reply({ content: `Portal Experience sharing cooldown for **${args[1]}** (${args[0]}) has been cleared.` });
            console.log(`${interaction.user.tag} (${interaction.user.id}) cleared ${args[1]}'s (${args[0]}) Portal Experience Sharing cooldown`);
        } else {
            interaction.reply({ content: `No Portal Experience Sharing cooldown found for user **${args[1]}** (${args[0]}).` });
        }

        // Get all queries and remove the expired cooldowns
        const allQueries = await Cooldowns.find({});
        allQueries.forEach(query => {
            if (query.cooldownEndsAtTimestamp < now) {
                query.remove();
            }
        })
    }
};