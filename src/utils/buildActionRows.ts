import { type APIActionRowComponent, type APIButtonComponent, ComponentType, type Message } from "discord.js";
import { buildDangerButton, buildLinkButton, buildSuccessButton } from "./buildButtons.ts";
import { createMessageLink } from "./createMessageLink.ts";

export const buildBaseAutoModActionRow = (
  messageLinkToAutomodAlert: string,
): APIActionRowComponent<APIButtonComponent> => {
  return {
    type: ComponentType.ActionRow,
    components: [buildLinkButton("Go To AutoMod Alert", messageLinkToAutomodAlert)],
  };
};

export const buildBaseAndActionsAutoModActionRow = (
  messageLinkToAutomodAlert: string,
  automodMemberId: string,
): APIActionRowComponent<APIButtonComponent> => {
  const baseRow = buildBaseAutoModActionRow(messageLinkToAutomodAlert);
  baseRow.components.push(
    buildDangerButton("Kick Member", `kick_member_${automodMemberId}`),
    buildSuccessButton("Remove Timeout", `remove_timeout_${automodMemberId}`),
  );
  return baseRow;
};

export const buildBaseAndCommandLinkAutoModActionRow = (
  commandLinkButtonLabel: string,
  messageLinkToAutomodAlert: string,
  kickCommandMessage: Message<true>,
): APIActionRowComponent<APIButtonComponent> => {
  const baseRow = buildBaseAutoModActionRow(messageLinkToAutomodAlert);
  baseRow.components.push(
    buildLinkButton(
      commandLinkButtonLabel,
      createMessageLink(kickCommandMessage.guildId, kickCommandMessage.channelId, kickCommandMessage.id),
    ),
  );
  return baseRow;
};
