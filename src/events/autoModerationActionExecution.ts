import {
  AutoModerationActionType,
  ButtonStyle,
  ComponentType,
  Events,
  PermissionFlagsBits,
  TextChannel,
  type APIActionRowComponent,
  type APIButtonComponent,
} from "discord.js";
import createEvent from "#utils/createEvent.js";

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

    const kickButtonRow: APIActionRowComponent<APIButtonComponent> = {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Danger,
          label: "Kick Member",
          custom_id: `kick_member_${automod.member.id}`,
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Success,
          label: "Remove Timeout",
          custom_id: `remove_timeout_${automod.member.id}`,
        },
      ],
    };

    const automodAlertChannel = automod.channel?.client.channels.cache.find(
      x => x.id === automod.action.metadata.channelId
    ) as TextChannel | undefined;

    if (!automodAlertChannel) return;

    const responseMsg = await automodAlertChannel.send({
      content: `Member **${automod.member.displayName}** has been flagged as a compromised account. What would you like to do?`,
      components: [kickButtonRow],
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
            components: [],
          });
          return;
        }

        // Kick member
        if (buttonInteraction.customId === `kick_member_${automod.member.id}`) {
          // Check kick permission
          if (!botHasPermissionToKick) {
            await buttonInteraction.update({
              content: ":x: Bot does not have the required permissions to kick members. Please fix.",
              components: [],
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
              components: [],
            });
          } catch (error) {
            buttonInteraction.update({
              content: `:x: Unable to kick compromised account ${automod.member.toString()}.`,
              components: [],
            });
          }
        }

        // Remove timeout
        if (buttonInteraction.customId === `remove_timeout_${automod.member.id}`) {
          // Check timeout permission
          if (!botHasPermissionToTimeout) {
            await buttonInteraction.update({
              content: ":x: Bot does not have the required permissions to manage timeouts. Please fix.",
              components: [],
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
              components: [],
            });
          } catch (error) {
            buttonInteraction.update({
              content: `:x: Unable to remove timeout of compromised account ${automod.member.toString()}.`,
              components: [],
            });
          }
        }
      });
  },
});
