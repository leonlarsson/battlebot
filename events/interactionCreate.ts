import { BaseInteraction, Client } from "discord.js";
import HumanizeDuration from "humanize-duration";
// import { commands } from "@/index";
import type { Event } from "@/types";
import getCommandUsed from "@/utils/getCommandUsed";
import { getCooldown } from "@/utils/handleCooldowns";

export default {
  name: "interactionCreate",
  execute(client, ...args) {
    return;
  },
  // execute: async (client: Client, interaction: BaseInteraction) => {
  //   // Handle the modal interactions
  //   //   if (interaction.type === InteractionType.ModalSubmit) {
  //   //     if (interaction.customId === "portalModal")
  //   //       return handlePortalModal(interaction);
  //   //     if (interaction.customId === "recruitmentModal")
  //   //       return handleRecruitmentModal(interaction);
  //   //   }

  //   if (!interaction.inGuild() || !interaction.channel?.isTextBased()) return;

  //   // Define command used
  //   const commandUsed = getCommandUsed(interaction);
  //   if (!commandUsed) return;

  //   if (
  //     !interaction.isContextMenuCommand() &&
  //     !interaction.isChatInputCommand()
  //   )
  //     return;

  //   // Get command and check if valid
  //   const command = commands.get(commandUsed);
  //   if (!command)
  //     return interaction.reply({
  //       content: "Not a valid command.",
  //       ephemeral: true,
  //     });

  //   // Public/enabled checks
  //   if (command.enabled === false)
  //     return interaction.reply({
  //       content: "Command is disabled.",
  //       ephemeral: true,
  //     });

  //   if (
  //     command.isPublic === false &&
  //     interaction.user.id !== "99182302885588992"
  //   )
  //     return interaction.reply({
  //       content: "Command is not available.",
  //       ephemeral: true,
  //     });

  //   // Perm check
  //   if (command.requiredPermissions) {
  //     const authorPerms = interaction.channel?.permissionsFor(interaction.user);
  //     if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
  //       return interaction.reply({
  //         content: "You don't have permission to run this.",
  //         ephemeral: true,
  //       });
  //     }
  //   }

  //   // Check for valid channel(s)
  //   if (command.allowedChannels) {
  //     // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
  //     if (
  //       !command.allowedChannels.includes(interaction.channel.id) &&
  //       interaction.user.id !== "99182302885588992"
  //     ) {
  //       return interaction.reply({
  //         content: command.wrongChannelReply,
  //         ephemeral: true,
  //       });
  //     }
  //   }

  //   // Check cooldown. If there is a cooldown and it hasn't expired, return and notify
  //   if (command.cooldown) {
  //     const { cooldown, cooldownExpiresTimestamp } = await getCooldown(
  //       interaction.user.id,
  //       command.name,
  //     );
  //     if (cooldown)
  //       return interaction.reply({
  //         content: `Please wait \`${HumanizeDuration(
  //           cooldownExpiresTimestamp - new Date().getTime(),
  //           { round: true, conjunction: " and " },
  //         )}\` before using this command again.`,
  //         ephemeral: true,
  //       });
  //   }

  //   // Run command
  //   command.execute(client, interaction);
  // },
} satisfies Event;
