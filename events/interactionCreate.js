/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const Cooldowns = require('../db/models/cooldown');
const HumanizeDuration = require('humanize-duration');

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
            if (interaction.options.getSubcommandGroup(false) === "cooldown") {
                if (interaction.options.getSubcommand() === "clear") commandUsed = "portal_clear";
                if (interaction.options.getSubcommand() === "view") commandUsed = "portal_view";
            }
        }

        if (interaction.commandName === "recruitment") {
            if (interaction.options.getSubcommand() === "post") commandUsed = "recruitment_post";
            if (interaction.options.getSubcommandGroup(false) === "cooldown") {
                if (interaction.options.getSubcommand() === "clear") commandUsed = "recruitment_clear";
                if (interaction.options.getSubcommand() === "view") commandUsed = "recruitment_view";
            }
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
            if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992a") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
                return interaction.reply({ content: command.wrong_channel_message, ephemeral: true });
            }
        }

        let args = [];

        if (interaction.commandName === "portal") {
            if (interaction.options.getSubcommand() === "post") {

                // Removing embeds on links and censor invite links
                args[0] = cleanMessage(interaction.options.get("name").value);
                args[1] = cleanMessage(interaction.options.get("description").value);
                args[5] = cleanMessage(interaction.options.get("experience_code").value);

                // Check length
                if (args[0].length > 150) return interaction.reply({ content: `\`Name\` needs to be 150 characters or less. You were at ${args[0].length}.`, ephemeral: true });
                if (args[1].length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${args[1].length}.`, ephemeral: true });
                if (args[5].length > 50) return interaction.reply({ content: `\`Experience Code\` needs to be 600 characters or less. You were at ${args[5].length}.`, ephemeral: true });

                // Check newlines
                if (args[0].includes("\n") || args[1].includes("\n") || args[5].includes("\n")) return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

            }

            if (interaction.options.getSubcommand() === "clear") {
                args[0] = interaction.options.get("user").user.id;
                args[1] = interaction.options.get("user").user.tag;
            }
            if (interaction.options.getSubcommand() === "view") {
                args[0] = interaction.options.get("user").user.id;
                args[1] = interaction.options.get("user").user.tag;
            }

        }

        if (interaction.commandName === "recruitment") {
            if (interaction.options.getSubcommand() === "post") {

                // Removing embeds on links and censor invite links
                args[0] = cleanMessage(interaction.options.get("name").value);
                args[1] = cleanMessage(interaction.options.get("description").value);
                args[2] = cleanMessage(interaction.options.get("platform").value);
                args[3] = cleanMessage(interaction.options.get("game").value);
                args[4] = cleanMessage(interaction.options.get("region").value);

                // Check length
                if (args[0].length > 50) return interaction.reply({ content: `\`Name\` needs to be 50 characters or less. You were at ${args[0].length}.`, ephemeral: true });
                if (args[1].length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${args[1].length}.`, ephemeral: true });
                if (args[2].length > 50) return interaction.reply({ content: `\`Platform\` needs to be 50 characters or less. You were at ${args[2].length}.`, ephemeral: true });
                if (args[3].length > 70) return interaction.reply({ content: `\`Game\` needs to be 70 characters or less. You were at ${args[3].length}.`, ephemeral: true });
                if (args[4].length > 50) return interaction.reply({ content: `\`Region\` needs to be 50 characters or less. You were at ${args[4].length}.`, ephemeral: true });

                // Check newlines
                if (args[0].includes("\n") || args[1].includes("\n") || args[2].includes("\n") || args[3].includes("\n") || args[4].includes("\n")) return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

            }

            if (interaction.options.getSubcommand() === "clear") {
                args[0] = interaction.options.get("user").user.id;
                args[1] = interaction.options.get("user").user.tag;
            }
            if (interaction.options.getSubcommand() === "view") {
                args[0] = interaction.options.get("user").user.id;
                args[1] = interaction.options.get("user").user.tag;
            }
        }

        // Cooldowns
        const now = new Date().getTime();
        const cooldownEnd = (now + command.cooldown);
        if (command.cooldown) {
            if (!command.cooldown_exempt?.includes(interaction.user.id)) {

                // Look for command cooldown for the user
                const query = await Cooldowns.findOne({
                    userId: interaction.user.id,
                    command: commandUsed,
                });

                // If a cooldown query exists, check if expired. If expired, update cooldown times and run command. If query does not exist, add one.
                if (query) {
                    if (query.cooldownEndsAtTimestamp > now) {
                        return interaction.reply({ content: `Please wait \`${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true, conjunction: " and " })}\` before using this command again.`, ephemeral: true });
                    } else {
                        let update;
                        if (commandUsed === "when") {
                            update = { commandUsedTimestamp: now, commandUsedDate: new Date(now), cooldownEndsAtTimestamp: cooldownEnd, cooldownEndsDate: new Date(cooldownEnd) };

                        } else if (commandUsed === "portal_post") {
                            update = { cooldownMessage: { Name: args[0], Description: args[1], Experience_Code: args[5] }, commandUsedTimestamp: now, commandUsedDate: new Date(now), cooldownEndsAtTimestamp: cooldownEnd, cooldownEndsDate: new Date(cooldownEnd) };

                        } else if (commandUsed === "recruitment_post") {
                            update = { cooldownMessage: { Name: args[0], Description: args[1], Platform: args[2], Game: args[3], Region: args[4] }, commandUsedTimestamp: now, commandUsedDate: new Date(now), cooldownEndsAtTimestamp: cooldownEnd, cooldownEndsDate: new Date(cooldownEnd) };
                        }
                        await query.updateOne(update);
                    }
                } else {
                    addCooldown();
                }
            }
        }

        command.execute(interaction, args, client); // Run command

        // Function to add cooldown query
        function addCooldown() {
            const cooldown = new Cooldowns({
                _id: mongoose.Types.ObjectId(),
                guildName: interaction.guild.name,
                guildId: interaction.guild.id,
                username: interaction.user.tag,
                userId: interaction.user.id,
                command: commandUsed,
                cooldownMessage: {
                    Name: args[0],
                    Description: args[1],
                    Platform: args[2],
                    Game: args[3],
                    Region: args[4],
                    Experience_Code: args[5]
                },
                commandUsedTimestamp: now,
                commandUsedDate: new Date(now),
                cooldownEndsAtTimestamp: cooldownEnd,
                cooldownEndsDate: new Date(cooldownEnd),
            });

            // Save the query to the DB
            cooldown.save()
                .catch(err => console.error(err));
        }

        // Remove invites and link embeds
        function cleanMessage(content) {
            const inviteRegex = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/[^\s/]+?(?=\b)/g;
            const linkRegex = /(http(s)?:\/\/.?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
            return content.replace(inviteRegex, "[INVITE REMOVED]").replace(linkRegex, `<$1>`);
        }
    }
};