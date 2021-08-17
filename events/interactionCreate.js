const Discord = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = await client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: "Not a valid command." })

        if (command.enabled === false) return interaction.reply({ content: "Command is disabled.", ephemeral: true });
        if (command.public === false && message.author.id !== "99182302885588992") return interaction.reply({ content: "Command is noty available.", ephemeral: true });

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

        if (interaction.commandName === "recruitment") {

            if (command.allowed_channels) {
                if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
                    return interaction.reply({ content: "This is only available in <#739938247089848351>", ephemeral: true });
                }
            }

            args[0] = interaction.options.get("name").value;
            args[1] = interaction.options.get("platform").value;
            args[2] = interaction.options.get("game").value;
            args[3] = interaction.options.get("region").value;
            args[4] = interaction.options.get("description").value;

            if (args[0].length > 50) return interaction.reply({ content: "`Name` needs to be 50 characters or less.", ephemeral: true });
            if (args[1].length > 50) return interaction.reply({ content: "`Platform` needs to be 50 characters or less.", ephemeral: true });
            if (args[2].length > 70) return interaction.reply({ content: "`Game` needs to be 70 characters or less.", ephemeral: true });
            if (args[3].length > 50) return interaction.reply({ content: "`Region` needs to be 50 characters or less.", ephemeral: true });
            if (args[4].length > 600) return interaction.reply({ content: "`Description` needs to be 600 characters or less.", ephemeral: true });

            // Cooldowns
            if (command.cooldown) {
                const { cooldowns } = client;

                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown) * 1000;

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 3600000; // Milliseconds to hours.
                        return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more hour(s) before reusing the \`${command.name}\` command.`, ephemeral: true });
                    }
                }

                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }

            command.execute(interaction, args);

        }

    }
};