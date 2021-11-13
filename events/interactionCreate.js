module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand() && !interaction.isContextMenu()) return;

        // Define command used
        let commandUsed;
        if (interaction.commandName === "Show userinfo") commandUsed = "userinfo";

        if (interaction.commandName === "when") commandUsed = "when";

        if (interaction.commandName === "portal") {
            if (interaction.options.getSubcommand() === "post") commandUsed = "portal_post";
            if (interaction.options.getSubcommand() === "cooldown") commandUsed = "portal_cooldown";
        }

        if (interaction.commandName === "recruitment") {
            if (interaction.options.getSubcommand() === "post") commandUsed = "recruitment_post";
            if (interaction.options.getSubcommand() === "cooldown") commandUsed = "recruitment_cooldown";
        }

        // Get command and check if valid
        const command = await client.commands.get(commandUsed);
        if (!command) return interaction.reply({ content: "Not a valid command.", ephemeral: true });

        // Public/enabled checks
        if (command.enabled === false) return interaction.reply({ content: "Command is disabled.", ephemeral: true });
        if (command.public === false && interaction.user.id !== "99182302885588992") return interaction.reply({ content: "Command is not available.", ephemeral: true });

        // Perm check
        if (command.permissions) {
            const authorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return interaction.reply({ content: "You don't have permission to run this.", ephemeral: true });
            }
        }

        // Check for valid channel(s)
        if (command.allowed_channels) {
            if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
                return interaction.reply({ content: command.wrong_channel_message, ephemeral: true });
            }
        }

        command.execute(interaction, client); // Run command
    }
};