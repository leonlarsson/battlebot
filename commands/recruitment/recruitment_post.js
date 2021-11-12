module.exports = {
    name: "recruitment_post",
    allowed_channels: ["739938247089848351"], // #recruitment, #mozzy-spam
    wrong_channel_message: "This is only available in <#739938247089848351>",
    cooldown: 172800000,
    // cooldown_exempt: ["99182302885588992", "106391128718245888"], // Mozzy, Dragory
    public: true,
    enabled: true,
    async execute(interaction, args) {

        // Lock to me only
        // if (interaction.user.id !== "99182302885588992") return interaction.reply({ content: "No.", ephemeral: true });

        interaction.reply({ content: `*Recruitment post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Name**: ${args[0]}\n**Platform(s)**: ${args[2]}\n**Game(s)**: ${args[3]}\n**Region(s)**: ${args[4]}\n**Description**: ${args[1]}`, allowedMentions: { users: [interaction.user.id] } });
    }
};