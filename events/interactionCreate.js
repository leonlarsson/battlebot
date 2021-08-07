const Discord = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = await client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: "Not a valid command." })

        // Perm Check.
        if (command.permissions) {
            const authorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
               return interaction.reply({ content: "You cannot run this :(", ephemeral: true });
            }
        }

        let args = [];

        if (interaction.commandName === "when") {
            if (interaction.options.get("text")?.value) {
                args[0] = interaction.options.get("text").value;
            }

            command.execute(interaction, args, client, Discord);
        }

    }
};