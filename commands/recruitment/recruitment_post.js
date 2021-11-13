const { checkCooldown, addCooldown } = require('../../utils/handleCooldowns');
const cleanMessage = require("../../utils/cleanMessage");

module.exports = {
    name: "recruitment_post",
    allowed_channels: ["739938247089848351"], // #recruitment, #mozzy-spam
    wrong_channel_message: "This is only available in <#739938247089848351>",
    cooldown: 172800000,
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
        const platform = cleanMessage(interaction.options.get("platform").value);
        const game = cleanMessage(interaction.options.get("game").value);
        const region = cleanMessage(interaction.options.get("region").value);

        // Check length
        if (name.length > 50) return interaction.reply({ content: `\`Name\` needs to be 50 characters or less. You were at ${name.length}.`, ephemeral: true });
        if (description.length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${description.length}.`, ephemeral: true });
        if (platform.length > 50) return interaction.reply({ content: `\`Platform\` needs to be 50 characters or less. You were at ${platform.length}.`, ephemeral: true });
        if (game.length > 70) return interaction.reply({ content: `\`Game\` needs to be 70 characters or less. You were at ${game.length}.`, ephemeral: true });
        if (region.length > 50) return interaction.reply({ content: `\`Region\` needs to be 50 characters or less. You were at ${region.length}.`, ephemeral: true });

        // Check newlines
        if (name.includes("\n") || description.includes("\n") || platform.includes("\n") || game.includes("\n") || region.includes("\n")) return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

        interaction.reply({ content: `*Recruitment post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Name**: ${name}\n**Platform(s)**: ${platform}\n**Game(s)**: ${game}\n**Region(s)**: ${region}\n**Description**: ${description}`, allowedMentions: { users: [interaction.user.id] } });

        // If there is no cooldown query, create a new one
        if (!query) addCooldown(interaction, this);
    }
};