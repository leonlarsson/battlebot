import { createFNBEvent } from "@/utils/createFNBEvent";
import {
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  type GuildMember,
  type APIActionRowComponent,
  type APIButtonComponent,
} from "discord.js";
import { guildPluginSlashCommand, slashOptions } from "knub";

export default guildPluginSlashCommand({
  name: "create_event",
  description: "[ADMIN] Manually creates an FNB event. Use only if the automated one fails.",
  signature: [],
  async run({ interaction }) {
    // Set allowed roles. FNB Staff & Admin (on BFD)
    const allowedRoles = ["907750002313539634", "140941611415633920"];

    if (
      !allowedRoles.some(r => (interaction.member as GuildMember | null)?.roles.cache.has(r)) &&
      interaction.user.id !== "99182302885588992"
    ) {
      interaction.reply({
        content: "You can't use this.",
        ephemeral: true,
      });
      return;
    }

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
