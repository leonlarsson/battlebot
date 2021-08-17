module.exports = {
    name: "recruitment",
    allowed_channels: ["739938247089848351"],
    cooldown: 172800, // Seconds
    public: true,
    enabled: true,
    async execute(interaction, args) {

        if (interaction.user.id !== "99182302885588992") return interaction.reply({ content: "No.", ephemeral: true });

        interaction.reply({ content: `*Recruitment post from <@${interaction.user.id}> (${interaction.user.id})*\n**Name**: ${args[0]}\n**Platform(s)**: ${args[1]}\n**Game(s)**: ${args[2]}\n**Region(s)**: ${args[3]}\n**Description**: ${args[4]}`, allowedMentions: { parse: [] } });

        console.log("New Recruitment Message", {
            User: `${interaction.user.tag} (${interaction.user.id})`,
            Name: args[0],
            Platform: args[1],
            Game: args[2],
            Region: args[3],
            Description: args[4],
        });
    }
};