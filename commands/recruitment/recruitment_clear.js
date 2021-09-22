const Cooldowns = require('../../db/models/cooldown');

module.exports = {
    name: "recruitment_clear",
    permissions: ["BAN_MEMBERS"],
    public: true,
    enabled: true,
    async execute(interaction, args) {

        //TODO: Maybe make only one find call?

        // If the entry point is the context menu command
        if (interaction.commandName === "Clear recr. cooldown") {
            args[0] = interaction.options.getUser("user").id;
            args[1] = interaction.options.getUser("user").tag;
        }
        const now = new Date().getTime();

        const query = await Cooldowns.findOne({
            userId: args[0],
            command: "recruitment_post"
        });

        // If query exists, remove and notify. If not, notify.
        if (query) {
            query.remove();
            interaction.reply({ content: `Recruitment cooldown for **${args[1]}** (${args[0]}) has been cleared.` });
        } else {
            interaction.reply({ content: `No recruitment cooldown found for user **${args[1]}** (${args[0]}).` });
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