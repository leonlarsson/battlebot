import { AutoModerationActionType, ComponentType, Events, PermissionFlagsBits, type TextChannel } from "discord.js";
import {
  buildBaseAndActionsAutoModActionRow,
  buildBaseAndCommandLinkAutoModActionRow,
  buildBaseAutoModActionRow,
} from "#utils/buildActionRows.js";
import createEvent from "#utils/createEvent.js";
import { createMessageLink } from "#utils/createMessageLink.js";

const modCommandsChannelId = process.env.ENVIRONMENT === "live" ? "591426310317015072" : "845402419038650418";

export default createEvent({
  name: Events.AutoModerationActionExecution,
  execute: async (automod) => {
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
      automod.alertSystemMessageId ?? "456",
    );

    const automodAlertChannel = automod.channel?.client.channels.cache.find(
      (x) => x.id === automod.action.metadata.channelId,
    ) as TextChannel | undefined;

    if (!automodAlertChannel) return;

    const responseMsg = await automodAlertChannel.send({
      content: `Member **${automod.member.toString()}** has been flagged as a compromised account. What would you like to do?`,
      components: [buildBaseAndActionsAutoModActionRow(messageLinkToAutomodAlert, automod.member.id)],
    });

    await responseMsg
      .awaitMessageComponent({
        componentType: ComponentType.Button,
        filter: (i) => i.member.permissions.has(PermissionFlagsBits.BanMembers),
      })
      .then(async (buttonInteraction) => {
        if (!automod.member) {
          await buttonInteraction.update({
            content: ":x: Member not found.",
            components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
          });
          return;
        }

        const modCommandsChannel = automod.guild.channels.cache.get(modCommandsChannelId) as TextChannel | undefined;
        if (!modCommandsChannel) {
          await buttonInteraction.update({
            content: ":x: Mod commands channel not found.",
            components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
          });
          return;
        }

        // Kick member
        if (buttonInteraction.customId === `kick_member_${automod.member.id}`) {
          try {
            const kickCommandMessage = await modCommandsChannel.send(
              `!kick ${automod.member.id} -mod ${buttonInteraction.member.id} Compromised account. ${messageLinkToAutomodAlert}`,
            );
            buttonInteraction.update({
              allowedMentions: {
                users: [],
              },
              content: `:wave: Compromised account ${automod.member.toString()} has been kicked by ${buttonInteraction.member.toString()}.`,
              components: [
                buildBaseAndCommandLinkAutoModActionRow(
                  "Go to !kick command",
                  messageLinkToAutomodAlert,
                  kickCommandMessage,
                ),
              ],
            });
          } catch (error) {
            buttonInteraction.update({
              content: ":x: Unable to send !kick command.",
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
          }
        }

        // Remove timeout
        if (buttonInteraction.customId === `remove_timeout_${automod.member.id}`) {
          try {
            const unmuteCommandMessage = await modCommandsChannel.send(
              `!unmute ${automod.member.id} -mod ${buttonInteraction.member.id} Not a compromised account`,
            );

            buttonInteraction.update({
              allowedMentions: {
                users: [],
              },
              content: `:white_check_mark: Member ${automod.member.toString()} has had their timeout removed by ${buttonInteraction.member.toString()}.`,
              components: [
                buildBaseAndCommandLinkAutoModActionRow(
                  "Go to !unmute command",
                  messageLinkToAutomodAlert,
                  unmuteCommandMessage,
                ),
              ],
            });
          } catch (error) {
            buttonInteraction.update({
              content: ":x: Unable to send !unmute command.",
              components: [buildBaseAutoModActionRow(messageLinkToAutomodAlert)],
            });
          }
        }
      });
  },
});
