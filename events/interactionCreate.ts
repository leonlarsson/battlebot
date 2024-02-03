import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Events, ModalSubmitInteraction } from "discord.js";
import { commands } from "@/index";
import getCommandUsed from "@/utils/getCommandUsed";
import { getCooldown } from "@/utils/handleCooldowns";
import createEvent from "@/utils/createEvent";
import humanizeDuration from "humanize-duration";

export default createEvent({
  name: Events.InteractionCreate,
  execute: async (
    client,
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | ModalSubmitInteraction,
  ) => {
    // Handle the modal interactions
    // if (interaction.isModalSubmit()) {
    //   if (interaction.customId === "portalModal") return handlePortalModal(interaction);
    //   if (interaction.customId === "recruitmentModal") return handleRecruitmentModal(interaction);

    //   return;
    // }

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

    // Check if command is public
    if (command.isPublic === false && interaction.user.id !== "99182302885588992") {
      interaction.reply({
        content: "Command is not available.",
        ephemeral: true,
      });
      return;
    }

    // Check for valid roles
    if (command.allowedRoles && !command.allowedRoles.some(r => interaction.member.roles.cache.has(r))) {
      interaction.reply({ content: "You can't use this.", ephemeral: true });
      return;
    }

    // Check for valid channels
    if (command.allowedChannels && !command.allowedChannels.includes(interaction.channelId)) {
      interaction.reply({ content: "You can't use this.", ephemeral: true });
      return;
    }

    // Check for valid users
    if (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) {
      interaction.reply({ content: "You can't use this.", ephemeral: true });
      return;
    }

    // Perm check
    if (command.requiredPermissions) {
      const authorPerms = interaction.channel?.permissionsFor(interaction.user);
      if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
        interaction.reply({
          content: "You don't have permission to run this.",
          ephemeral: true,
        });
        return;
      }
    }

    // Check for valid channel(s)
    if (command.allowedChannels) {
      // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
      if (!command.allowedChannels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") {
        interaction.reply({
          content: command.wrongChannelReply,
          ephemeral: true,
        });
        return;
      }
    }

    // Check cooldown. If there is a cooldown and it hasn't expired, return and notify
    if (command.cooldown) {
      const { cooldown, cooldownExpiresTimestamp } = await getCooldown(interaction.user.id, command.name);
      if (cooldown)
        interaction.reply({
          content: `Please wait \`${humanizeDuration(cooldownExpiresTimestamp - new Date().getTime(), {
            round: true,
            conjunction: " and ",
          })}\` before using this command again.`,
          ephemeral: true,
        });
      return;
    }

    // Run command
    command.execute(interaction);
  },
});
