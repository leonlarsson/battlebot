const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {

        var time = new Date().toISOString().substr(11, 5) + " UTC"

        // Ignore if no prefix or bot user
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return; // If not a command, return.

        // Bot permissions tests - Check only if a correct command was found.
        if (!message.channel.permissionsFor(client.user).toArray().includes("SEND_MESSAGES")) {
            return console.log(`[${time}] Missing "SEND_MESSAGES" permission in ${message.guild.name} (${message.guild.id}).`);
        }

        if (!message.channel.permissionsFor(client.user).toArray().includes("ATTACH_FILES")) {
            return message.reply(`I need the \`Attach Files\` permission to do this.`);
        }

        if (command.disabled) return;
        if (command.public == false && message.author.id != "99182302885588992") return; // If command is not public, return.

        // Perm Check.
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return;
            }
        }

        // Cooldowns
        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // Run Command
        try {
            command.execute(message, args, client, Discord);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    },
};