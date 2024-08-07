import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { ComponentType, type ModalSubmitInteraction, TextInputStyle } from "discord.js";
import { setCooldown } from "#utils/handleCooldowns.ts";
dayjs.extend(utc);
import cleanMessage from "#utils/cleanMessage.ts";
import createCommand from "#utils/createCommand.ts";

const cooldown = 172_800_000; // ms: 48 hours

export default createCommand({
  name: "recruitment_post",
  enabled: true,
  isPublic: true,
  allowedChannels: ["739938247089848351", "845402419038650418"], // #recruitment, #bot-dev
  wrongChannelReply: "This is only available in <#739938247089848351>",
  cooldown,
  execute: async (interaction) => {
    const recruitmentModal = {
      title: "Share Your Recruitment Post",
      custom_id: "recruitmentModal",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Short,
              custom_id: "recruitmentNameInput",
              required: true,
              min_length: 5,
              max_length: 50,
              label: "Name:",
              placeholder: "Mozzy's Cool Clan",
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Short,
              custom_id: "recruitmentPlatformInput",
              required: true,
              min_length: 1,
              max_length: 50,
              label: "Platform(s):",
              placeholder: "PC and PlayStation",
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Short,
              custom_id: "recruitmentGameInput",
              required: true,
              min_length: 1,
              max_length: 70,
              label: "Game(s):",
              placeholder: "Battlefield 1 only (GOTY!)",
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Short,
              custom_id: "recruitmentRegionInput",
              required: true,
              min_length: 1,
              max_length: 50,
              label: "Region(s):",
              placeholder: "All regions - Mr. Worldwide!",
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Paragraph,
              custom_id: "recruitmentDescriptionInput",
              required: true,
              min_length: 5,
              max_length: 400,
              label: "Description (NO LINEBREAKS):",
              placeholder: "This is an absolutely amazing clan. No linebreaks allowed.",
            },
          ],
        },
      ],
    };

    // Show modal
    // @ts-expect-error
    interaction.showModal(recruitmentModal);
  },
});

export const handleRecruitmentModal = async (interaction: ModalSubmitInteraction) => {
  // Removing embeds on links and censor invite links
  const name = interaction.fields.getTextInputValue("recruitmentNameInput");
  const platform = interaction.fields.getTextInputValue("recruitmentPlatformInput");
  const game = interaction.fields.getTextInputValue("recruitmentGameInput");
  const region = interaction.fields.getTextInputValue("recruitmentRegionInput");
  const description = interaction.fields.getTextInputValue("recruitmentDescriptionInput");

  // Check newlines, and inform the user if there are newlines
  if ((name + platform + game + region + description).includes("\n"))
    return interaction.reply({
      content: `Your message cannot contain any linebreaks.\n**Name**: ${name}\n**Platform(s)**: ${platform}\n**Game(s)**: ${game}\n**Region(s)**: ${region}\n**Description**: ${description}`,
      ephemeral: true,
    });

  interaction.reply({
    content: `*Recruitment post from ${interaction.user.username} <@${interaction.user.id}>*\n**Name**: ${cleanMessage(
      name,
    )}\n**Platform(s)**: ${cleanMessage(platform)}\n**Game(s)**: ${cleanMessage(game)}\n**Region(s)**: ${cleanMessage(
      region,
    )}\n**Description**: ${cleanMessage(description)}`,
    allowedMentions: { users: [interaction.user.id] },
  });

  // Set cooldown
  setCooldown(interaction.user.id, "recruitment_post", new Date().getTime() + cooldown);
};
