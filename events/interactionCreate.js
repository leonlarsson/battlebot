/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const Cooldowns = require('../models/cooldown');
const HumanizeDuration = require('humanize-duration');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        //TODO: Fix getting command and subcommand and all that stuff

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
        }

        if (interaction.commandName === "recruitment") {

            if (interaction.options.getSubcommand() === "post") {

                if (command.allowed_channels) {
                    if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
                        return interaction.reply({ content: "This is only available in <#739938247089848351>", ephemeral: true });
                    }
                }

                // console.log("New recruitment message (Raw)", {
                //     User: `${interaction.user.tag} (${interaction.user.id})`,
                //     Name: interaction.options.get("name").value,
                //     Platform: interaction.options.get("platform").value,
                //     Game: interaction.options.get("game").value,
                //     Region: interaction.options.get("region").value,
                //     Description: interaction.options.get("description").value,
                // });

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

            }

            if (interaction.options.getSubcommand() === "clear") {
                args[0] = interaction.options.get("user");
            }
        }

        command.execute(interaction, args, client); // Run command

        // Cooldowns
        const now = new Date().getTime();
        const cooldownEnd = (now + command.cooldown);
        if (!command.cooldown_exempt?.includes(interaction.user.id)) {

            const query = await Cooldowns.findOne({
                userId: interaction.user.id,
                command: interaction.commandName,
            });

            if (query) {
                if (query.cooldownEndsAtTimestamp > now) {
                    console.log("Cooldown found and is active");
                    return interaction.reply({ content: `Please wait ${HumanizeDuration(query.cooldownEndsAtTimestamp - now, { round: true })}.`, ephemeral: true });
                } else {
                    const update = { commandUsedTimestamp: now, commandUsedDate: new Date(now), cooldownEndsAtTimestamp: cooldownEnd, cooldownEndsDate: new Date(cooldownEnd) };
                    console.log("Cooldown found and is expired");
                    await query.updateOne(update);
                }
            } else {
                addCooldown();
            }
        }

        function addCooldown() {
            const cooldown = new Cooldowns({
                _id: mongoose.Types.ObjectId(),
                guildName: interaction.guild.name,
                guildId: interaction.guild.id,
                username: interaction.user.tag,
                userId: interaction.user.id,
                command: interaction.commandName,
                commandUsedTimestamp: now,
                commandUsedDate: new Date(now),
                cooldownEndsAtTimestamp: cooldownEnd,
                cooldownEndsDate: new Date(cooldownEnd),
            });

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