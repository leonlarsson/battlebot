import { Events } from "discord.js";
import humanizeDuration from "humanize-duration";
import { commands } from "#index.js";
import getCommandUsed from "#utils/getCommandUsed.js";
import { getCooldown } from "#utils/handleCooldowns.js";
import createEvent from "#utils/createEvent.js";
import { handlePortalModal } from "#commands/portal/post.js";
import { handleRecruitmentModal } from "#commands/recruitment/post.js";

export default createEvent({
  name: Events.InteractionCreate,
  execute: async interaction => {
    // Handle the modal interactions
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "portalModal") return handlePortalModal(interaction);
      if (interaction.customId === "recruitmentModal") return handleRecruitmentModal(interaction);
      return;
    }

    if (!interaction.inCachedGuild() || !interaction.channel?.isTextBased()) return;

    // Define command used
    const commandUsed = getCommandUsed(interaction);
    if (!commandUsed) return;

    if (!interaction.isContextMenuCommand() && !interaction.isChatInputCommand()) return;

    // Get command and check if valid
    const command = commands.get(commandUsed);
    if (!command) {
      interaction.reply({
        content: "Not a valid command.",
        ephemeral: true,
      });
      return;
    }

    // Check if command is enabled
    if (command.enabled === false) {
      interaction.reply({
        content: "Command is disabled.",
        ephemeral: true,
      });
      return;
    }

    // Check if user is Mozzy, bypassing all checks
    const isMozzy = interaction.user.id === "99182302885588992";

    // Check if command is public
    if (!isMozzy && command.isPublic === false) {
      interaction.reply({ content: "Command is not public.", ephemeral: true });
      return;
    }

    // Check for valid roles
    if (!isMozzy && command.allowedRoles && !command.allowedRoles.some(r => interaction.member.roles.cache.has(r))) {
      interaction.reply({ content: "Insuffcient permission: roles.", ephemeral: true });
      return;
    }

    // Check for valid channels
    if (!isMozzy && command.allowedChannels && !command.allowedChannels.includes(interaction.channelId)) {
      interaction.reply({ content: command.wrongChannelReply ?? "You can't use this here.", ephemeral: true });
      return;
    }

    // Check for valid users
    if (!isMozzy && command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) {
      interaction.reply({ content: "Insuffcient permission: users.", ephemeral: true });
      return;
    }

    // Perm check
    if (!isMozzy && command.requiredPermissions) {
      const authorPerms = interaction.channel?.permissionsFor(interaction.user);
      if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
        interaction.reply({ content: "Insuffcient permission: permissions.", ephemeral: true });
        return;
      }
    }

    // Check cooldown. If there is a cooldown and it hasn't expired, return and notify
    if (!isMozzy && command.cooldown) {
      const { cooldown, cooldownExpiresTimestamp } = await getCooldown(interaction.user.id, command.name);

      if (cooldown) {
        interaction.reply({
          content: `Please wait \`${humanizeDuration(cooldownExpiresTimestamp - new Date().getTime(), {
            round: true,
            conjunction: " and ",
          })}\` before using this command again.`,
          ephemeral: true,
        });
        return;
      }
    }

    // Run command
    command.execute(interaction);
  },
});
