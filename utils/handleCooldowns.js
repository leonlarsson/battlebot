// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import mongoose from "mongoose";
import Cooldowns from "../db/models/cooldown.js";

/**
 * Get a cooldown query for a command.
 * @param {CommandInteraction} interaction The interaction.
 * @param {Object} command - The command.
 * @returns {Promise<Object|false} Returns the query or false.
 */
export async function getCooldownQuery(interaction, command) {
    // Look for command cooldown for the user
    const query = await Cooldowns.findOne({
        userId: interaction.user.id,
        command: command.name
    });

    return query ? query : false;
}

/**
 * Check if the cooldown has expired.
 * @param {Cooldowns} query The cooldown DB object.
 * @returns {Object} expired, expiresAt, expiresIn
 */
export async function checkIfCooldownExpired(query) {
    const now = new Date().getTime();
    const expiresAt = query.cooldownEndsAtTimestamp;
    const expiresIn = query.cooldownEndsAtTimestamp - now;
    const expired = expiresAt < now;
    return { expired, expiresAt, expiresIn };
}

/**
 * Updates a cooldown query or adds one.
 * @param {CommandInteraction} interaction The interaction.
 * @param {Object} command - The command.
 */
export async function updateOrAddCooldown(interaction, command) {

    const query = await getCooldownQuery(interaction, command);
    const now = new Date().getTime();

    if (query && query.cooldownEndsAtTimestamp < now) {
        updateCooldown(command, query);
    } else if (!query) {
        addCooldown(interaction, command)
    }
}

/**
 * Updates a cooldown query.
 * @param {Object} command The command.
 * @param {Object} query - The cooldown DB object.
 */
export async function updateCooldown(command, query) {
    const now = new Date().getTime();
    const cooldownEnd = now + command.cooldown;
    await query.updateOne({ commandUsedTimestamp: now, commandUsedDate: new Date(now), cooldownEndsAtTimestamp: cooldownEnd, cooldownEndsDate: new Date(cooldownEnd) });
}

/**
 * Adds a cooldown query.
 * @param {CommandInteraction} interaction The interaction.
 * @param {Object} command - The command.
 */
export async function addCooldown(interaction, command) {
    const now = new Date().getTime();

    const cooldownEnd = (now + command.cooldown);
    const cooldown = new Cooldowns({
        _id: mongoose.Types.ObjectId(),
        guildName: interaction.guild.name,
        guildId: interaction.guild.id,
        username: interaction.user.tag,
        userId: interaction.user.id,
        command: command.name,
        commandUsedTimestamp: now,
        commandUsedDate: new Date(now),
        cooldownEndsAtTimestamp: cooldownEnd,
        cooldownEndsDate: new Date(cooldownEnd)
    });

    cooldown.save().catch(err => console.error(err));
}