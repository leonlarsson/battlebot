module.exports = {
    name: "recruitment",
    allowed_channels: ["739938247089848351"],
    // cooldown: 172800, // Seconds
    public: true,
    enabled: true,
    async execute(interaction, args) {

        interaction.reply({ content: `*Post from <@${interaction.user.id}>*\nName: ${args[0]}\nPlatform: ${args[1]}\nGame: ${args[2]}\nRegion: ${args[3]}\nDescription: ${args[4]}`, allowedMentions: { parse: [] } });

    }
};