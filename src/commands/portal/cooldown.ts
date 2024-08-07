import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import {
  type APIActionRowComponent,
  type APIButtonComponent,
  type ButtonInteraction,
  ButtonStyle,
  ComponentType,
  PermissionFlagsBits,
  type User,
} from "discord.js";
import HumanizeDuration from "humanize-duration";
import { deleteCooldown, getCooldown, setCooldown } from "#utils/handleCooldowns.ts";
dayjs.extend(utc);
import createCommand from "#utils/createCommand.ts";

export default createCommand({
  name: "portal_cooldown",
  enabled: true,
  isPublic: true,
  requiredPermissions: [PermissionFlagsBits.BanMembers],
  execute: async (interaction) => {
    const targetUser = interaction.options.getUser("user") as User;

    const now = new Date().getTime();

    const { cooldown, cooldownExpiresTimestamp } = await getCooldown(targetUser.id, "portal_post");

    if (!cooldown)
      return interaction.reply({
        content: `No Portal Experience sharing cooldown found for user **${targetUser.username}** (${targetUser.id}).`,
      });

    // Build day.js
    const cooldownExpiresAt = dayjs.utc(cooldownExpiresTimestamp).format("dddd, D MMM YYYY, hh:mm A UTC");

    const row = {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: "Clear Cooldown",
          custom_id: "clearCooldown",
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Primary,
          label: "Set Cooldown To Year 9999",
          custom_id: "setLongCooldown",
        },
      ],
    } satisfies APIActionRowComponent<APIButtonComponent>;

    const cooldownViewEmbed = {
      title: `Portal Experience sharing cooldown for ${targetUser.username} (${targetUser.id})`,
      footer: { text: "Click on 'Clear Cooldown' to clear this user's cooldown." },
      fields: [
        {
          name: "Cooldown ends",
          value: `In ${HumanizeDuration(cooldownExpiresTimestamp - now, { round: true })}\nOn ${cooldownExpiresAt}`,
        },
      ],
    };

    const responseMsg = await interaction.reply({
      embeds: [cooldownViewEmbed],
      components: [row],
      fetchReply: true,
    });

    const clearCooldownFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
    responseMsg
      .awaitMessageComponent({ filter: clearCooldownFilter, time: 30000, componentType: ComponentType.Button })
      .then(async (buttonInteraction) => {
        // On collect, remove cooldown. Update response and remove button. setLongCooldown sets cooldown to year 9999
        if (buttonInteraction.customId === "clearCooldown") {
          await deleteCooldown(targetUser.id, "portal_post");

          buttonInteraction.update({
            embeds: [
              {
                ...cooldownViewEmbed,
                description: `**✅ __COOLDOWN CLEARED BY ${buttonInteraction.user.username}__ ✅**`,
                footer: { text: "Cooldown cleared." },
              },
            ],
            components: [],
          });
          console.log(
            `${buttonInteraction.user.username} (${buttonInteraction.user.id}) cleared ${targetUser.username}'s (${targetUser.id}) Portal Experience sharing cooldown.`,
          );
        }

        if (buttonInteraction.customId === "setLongCooldown") {
          // Set the new timestamp
          await setCooldown(targetUser.id, "portal_post", 253370764800000);

          // Update embed
          const newEmbed = {
            ...cooldownViewEmbed,
            description: `**✅ __COOLDOWN SET TO YEAR 9999 BY ${buttonInteraction.user.username}__ ✅**`,
            footer: { text: "Cooldown increased (a lot)." },
            field: [
              {
                name: "Cooldown ends (updated)",
                value: `In ${HumanizeDuration(253370764800000 - now, { round: true })}\nOn ${dayjs
                  .utc(253370764800000)
                  .format("dddd, D MMM YYYY, hh:mm A UTC")}`,
              },
            ],
          };

          buttonInteraction.update({ embeds: [newEmbed], components: [] });
          console.log(
            `${buttonInteraction.user.username} (${buttonInteraction.user.id}) set ${targetUser.username}'s (${targetUser.id}) Portal Experience sharing cooldown to year 9999.`,
          );
        }
      })
      .catch(() => {
        interaction.editReply({ embeds: [{ ...cooldownViewEmbed, footer: { text: "" } }], components: [] });
      });
  },
});
