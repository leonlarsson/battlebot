import {
  ButtonStyle,
  ComponentType,
  type APIActionRowComponent,
  type APIButtonComponent,
  ButtonInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { createFNBEvent } from "@/utils/createFNBEvent";
import createCommand from "@/utils/createCommand";

export default createCommand<ChatInputCommandInteraction>({
  name: "fnb_create_event",
  enabled: true,
  isPublic: true,
  // Set allowed roles. FNB Staff & Admin (on BFD)
  allowedRoles: ["907750002313539634", "140941611415633920"],
  execute: async interaction => {
    const row = {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: "Yes, create event",
          custom_id: "create",
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Danger,
          label: "No, cancel",
          custom_id: "cancel",
        },
      ],
    } satisfies APIActionRowComponent<APIButtonComponent>;

    const responseMsg = await interaction.reply({
      content:
        "Are you sure you want to create an FNB event?\n**Note:** Only create an event if the automatic process fails.",
      components: [row],
      fetchReply: true,
    });

    const filter = (i: ButtonInteraction) => {
      if (i.user.id === interaction.user.id) return true;
      i.reply({ content: "You can't use this.", ephemeral: true });
      return false;
    };

    responseMsg
      .awaitMessageComponent({
        filter,
        time: 20000,
        componentType: ComponentType.Button,
      })
      .then(buttonInteraction => {
        if (buttonInteraction.customId === "create") {
          console.log(`${interaction.user.username} (${interaction.user.id}) confirmed FNB event-creation.`);
          createFNBEvent(interaction.client, interaction);
        }

        if (buttonInteraction.customId === "cancel") {
          return buttonInteraction.update({
            content: "Cancelling FNB event-creation.",
            components: [],
          });
        }
      })
      .catch(() => {
        interaction.editReply({
          content: "Cancelling FNB event-creation.",
          components: [],
        });
      });
  },
});
