module.exports = {
    name: "portal_post",
    allowed_channels: ["908101543646089236", "845402419038650418"], // #portal-sharing, #mozzy-spam
    cooldown: 86400000,
    // cooldown_exempt: ["99182302885588992", "106391128718245888"], // Mozzy, Dragory
    public: true,
    enabled: true,
    async execute(interaction, args) {

        // Lock to me only
        // if (interaction.user.id !== "99182302885588992") return interaction.reply({ content: "No.", ephemeral: true });

        interaction.reply({ content: `*Portal Experience Share post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Experience Name**: ${args[0]}\n**Experience Description**: ${args[1]}\n**Experience Code**: ${args[5]}\n`, allowedMentions: { users: [interaction.user.id] } });
    }
};