const { checkCooldown, addCooldown } = require('../../utils/handleCooldowns');
const cleanMessage = require("../../utils/cleanMessage");

module.exports = {
    name: "portal_post",
    allowed_channels: ["908101543646089236"], // #portal-sharing, #mozzy-spam
    wrong_channel_message: "This is only available in <#908101543646089236>",
    cooldown: 43200000,
    public: true,
    enabled: true,
    async execute(interaction) {

        // Lock to me only
        // if (interaction.user.id !== "99182302885588992") return interaction.reply({ content: "No.", ephemeral: true });

        // Check if there is a DB cooldown query. If there is no query, run code and add cooldown at the bottom. If there is an active one, return and reply. If there is an expired one, update the query
        const query = await checkCooldown(interaction, this);
        if (query && query.cooldownEndsAtTimestamp > new Date().getTime()) return;

        // Removing embeds on links and censor invite links
        const name = cleanMessage(interaction.options.get("name").value);
        const description = cleanMessage(interaction.options.get("description").value);
        const experienceCode = cleanMessage(interaction.options.get("experience_code").value);

        // Check length
        if (name.length > 150) return interaction.reply({ content: `\`Name\` needs to be 150 characters or less. You were at ${name.length}.`, ephemeral: true });
        if (description.length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${description.length}.`, ephemeral: true });
        if (experienceCode.length > 50) return interaction.reply({ content: `\`Experience Code\` needs to be 50 characters or less. You were at ${experienceCode.length}.`, ephemeral: true });

        // Check newlines
        if (name.includes("\n") || description.includes("\n") || experienceCode.includes("\n")) return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

        const msg = await interaction.reply({ content: `*Portal Experience sharing post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Experience Name**: ${name}\n**Experience Description**: ${description}\n**Experience Code**: ${experienceCode}\n`, allowedMentions: { users: [interaction.user.id] }, fetchReply: true });

        msg.startThread({
            name: name,
            autoArchiveDuration: 4320,
            reason: "Auto-created thread for Portal Experience sharing post."
        });

        // If there is no cooldown query, create a new one
        if (!query) addCooldown(interaction, this);
    }
};