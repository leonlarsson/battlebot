import { AutoModerationActionType, ComponentType, Events, PermissionFlagsBits, TextChannel } from "discord.js";
import createEvent from "#utils/createEvent.js";
import { buildBaseAndActionsAutoModActionRow, buildBaseAutoModActionRow } from "#utils/buildActionRows.js";
import { createMessageLink } from "#utils/createMessageLink.js";

export default createEvent({
  name: Events.AutoModerationActionExecution,
  execute: async automod => {
    // Only run once
    if (automod.action.type !== AutoModerationActionType.SendAlertMessage) return;

    // Fetch the automod rules
    await automod.guild.autoModerationRules.fetch();

    if (automod.autoModerationRule?.name !== "Compromised Account Filter") return;

    if (!automod.member) {
      console.log("[DEBUG] autoModerationActionExecution: Member not found in automod object.");
      return;
    }

    const messageLinkToAutomodAlert = createMessageLink(
      automod.guild.id,
      automod.action.metadata.channelId ?? "123",
      automod.alertSystemMessageId ?? "456"
    );

    const automodAlertChannel = automod.channel?.client.channels.cache.find(
      x => x.id === automod.action.metadata.channelId
    ) as TextChannel | undefined;

    if (!automodAlertChannel) return;

    const responseMsg = await automodAlertChannel.send({
      content: `Member **${automod.member.toString()}** has been flagged as a compromised account. What would you like to do?`,
      components: [buildBaseAndActionsAutoModActionRow(messageLinkToAutomodAlert, automod.member.id)],
    });

    await responseMsg
      .awaitMessageComponent({
        componentType: ComponentType.Button,
        filter: i => i.member.permissions.has(PermissionFlagsBits.BanMembers),
      })
      .then(async buttonInteraction => {
        // Check if bot has both kick permission and timeout permission
        const botHasPermissionToKick = buttonInteraction.appPermissions.has(PermissionFlagsBits.KickMembers);
        const botHasPermissionToTimeout = buttonInteraction.appPermissions.has(PermissionFlagsBits.ModerateMembers);

        if (!automod.member) {
          await buttonInteraction.update({
            content: ":x: Member not found.",
            components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
          });
          return;
        }

        // Kick member
        if (buttonInteraction.customId === `kick_member_${automod.member.id}`) {
          // Check kick permission
          if (!botHasPermissionToKick) {
            await buttonInteraction.update({
              content: ":x: Bot does not have the required permissions to kick members. Please fix.",
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
            return;
          }

          try {
            await automod.member.kick("Compromised account");
            buttonInteraction.update({
              allowedMentions: {
                users: [],
              },
              content: `:wave: Compromised account ${automod.member.toString()} has been kicked by ${buttonInteraction.member.toString()}.`,
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
          } catch (error) {
            buttonInteraction.update({
              content: `:x: Unable to kick compromised account ${automod.member.toString()}.`,
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
          }
        }

        // Remove timeout
        if (buttonInteraction.customId === `remove_timeout_${automod.member.id}`) {
          // Check timeout permission
          if (!botHasPermissionToTimeout) {
            await buttonInteraction.update({
              content: ":x: Bot does not have the required permissions to manage timeouts. Please fix.",
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
            return;
          }

          try {
            await automod.member.timeout(null, `Timeout removed by ${buttonInteraction.member.toString()}`);
            buttonInteraction.update({
              allowedMentions: {
                users: [],
              },
              content: `:white_check_mark: Member ${automod.member.toString()} has had their timeout removed by ${buttonInteraction.member.toString()}.`,
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
          } catch (error) {
            buttonInteraction.update({
              content: `:x: Unable to remove timeout of compromised account ${automod.member.toString()}.`,
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
          }
        }
      });
  },
});
