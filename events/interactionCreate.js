/* eslint-disable no-useless-escape */
const Discord = require('discord.js');
const HumanizeDuration = require('humanize-duration');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = await client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: "Not a valid command.", ephemeral: true });

        if (command.enabled === false) return interaction.reply({ content: "Command is disabled.", ephemeral: true });
        if (command.public === false && interaction.user.id !== "99182302885588992") return interaction.reply({ content: "Command is not available.", ephemeral: true });

        // Perm Check.
        if (command.permissions) {
            const authorPerms = interaction.channel.permissionsFor(interaction.user);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return interaction.reply({ content: "You cannot run this :(", ephemeral: true });
            }
        }

        let args = [];

        if (interaction.commandName === "when") {

            if (command.allowed_channels) {
                if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
                    return interaction.reply({ content: "This is only available in <#850376380822323230> and <#177094649473794049>", ephemeral: true });
                }
            }

            command.execute(interaction, client);
        }

        if (interaction.commandName === "recruitment") {

            if (command.allowed_channels) {
                if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
                    return interaction.reply({ content: "This is only available in <#739938247089848351>", ephemeral: true });
                }
            }

            console.log("New recruitment message (Raw)", {
                User: `${interaction.user.tag} (${interaction.user.id})`,
                Name: interaction.options.get("name").value,
                Platform: interaction.options.get("platform").value,
                Game: interaction.options.get("game").value,
                Region: interaction.options.get("region").value,
                Description: interaction.options.get("description").value,
            });

            // Removing embeds on links and censor invite links
            args[0] = cleanMessage(interaction.options.get("name").value);
            args[1] = cleanMessage(interaction.options.get("platform").value);
            args[2] = cleanMessage(interaction.options.get("game").value);
            args[3] = cleanMessage(interaction.options.get("region").value);
            args[4] = cleanMessage(interaction.options.get("description").value);

            // Check length
            if (args[0].length > 50) return interaction.reply({ content: `\`Name\` needs to be 50 characters or less. You were at ${args[0].length}.`, ephemeral: true });
            if (args[1].length > 50) return interaction.reply({ content: `\`Platform\` needs to be 50 characters or less. You were at ${args[1].length}.`, ephemeral: true });
            if (args[2].length > 70) return interaction.reply({ content: `\`Game\` needs to be 70 characters or less. You were at ${args[2].length}.`, ephemeral: true });
            if (args[3].length > 50) return interaction.reply({ content: `\`Region\` needs to be 50 characters or less. You were at ${args[3].length}.`, ephemeral: true });
            if (args[4].length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${args[4].length}.`, ephemeral: true });

            // Check newlines
            if (args[0].includes("\n") || args[1].includes("\n") || args[2].includes("\n") || args[3].includes("\n") || args[4].includes("\n")) return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

            // Cooldowns. If user is exempt, don't do cooldown stuff
            if (!command.cooldown_exempt.includes(interaction.user.id)) {
                if (command.cooldown) {
                    const { cooldowns } = client;

                    if (!cooldowns.has(command.name)) {
                        cooldowns.set(command.name, new Discord.Collection());
                    }

                    const now = Date.now();
                    const timestamps = cooldowns.get(command.name);
                    const cooldownAmount = (command.cooldown) * 1000; // time in milliseconds

                    if (timestamps.has(interaction.user.id)) {
                        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                        if (now < expirationTime) {
                            return interaction.reply({ content: `Please wait ${HumanizeDuration(cooldownAmount)} before reusing the \`${command.name}\` command.`, ephemeral: true });
                        }
                    }

                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                }
            }

            command.execute(interaction, args);

        }

        // Remove invites and link embeds
        function cleanMessage(content) {
            const inviteRegex = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/[^\s/]+?(?=\b)/g;
            const linkRegex = /(http(s)?:\/\/.?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
            return content.replace(inviteRegex, "[INVITE REMOVED]").replace(linkRegex, `<$1>`);
        }

    }
};