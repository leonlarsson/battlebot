import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { ComponentType, type ModalSubmitInteraction, TextInputStyle, escapeMarkdown, resolveColor } from "discord.js";
import { setCooldown } from "#utils/handleCooldowns.ts";
dayjs.extend(utc);
import cleanMessage from "#utils/cleanMessage.ts";
import createCommand from "#utils/createCommand.ts";

const cooldown = 43_200_000; // ms: 12 hours

export default createCommand({
  name: "portal_post",
  enabled: true,
  isPublic: true,
  allowedChannels: ["908101543646089236", "845402419038650418"], // #portal-sharing, #bot-dev
  wrongChannelReply: "This is only available in <#908101543646089236>",
  cooldown,
  execute: async (interaction) => {
    const portalModal = {
      title: "Share Your Portal Experience",
      custom_id: "portalModal",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Short,
              custom_id: "portalExperienceCodeInput",
              required: true,
              min_length: 1,
              max_length: 100,
              label: "Experience Code:",
              placeholder: "AATCVC",
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Short,
              custom_id: "portalNameInput",
              required: true,
              min_length: 5,
              max_length: 100,
              label: "Experience Name:",
              placeholder: "Mozzy's 24/7 Nosehair Canals TDM",
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Paragraph,
              custom_id: "portalDescriptionInput",
              required: true,
              min_length: 5,
              max_length: 400,
              label: "Experience Description (NO LINEBREAKS):",
              placeholder: "This is an absolutely amazing experience. No linebreaks allowed.",
            },
          ],
        },
      ],
    };

    // Show modal
    // @ts-expect-error
    interaction.showModal(portalModal);
  },
});

export const handlePortalModal = async (interaction: ModalSubmitInteraction) => {
  const experienceCode = interaction.fields.getTextInputValue("portalExperienceCodeInput");
  const experienceName = interaction.fields.getTextInputValue("portalNameInput");
  const experienceDescription = interaction.fields.getTextInputValue("portalDescriptionInput");

  // Check newlines, and inform the user if there are newlines
  if (experienceName.includes("\n") || experienceCode.includes("\n") || experienceDescription.includes("\n"))
    return interaction.reply({
      content: `Your message cannot contain any linebreaks.\n\n**Experience Code**: ${experienceCode}\n**Name**: ${experienceName}\n**Description**: ${experienceDescription}`,
      ephemeral: true,
    });

  const msg = await interaction.reply({
    content: `*Portal Experience sharing post from ${interaction.user.username} <@${
      interaction.user.id
    }>*\n**Experience Code**: ${cleanMessage(experienceCode)}\n**Experience Name**: ${cleanMessage(
      experienceName,
    )}\n**Experience Description**: ${cleanMessage(experienceDescription)}`,
    allowedMentions: { users: [interaction.user.id] },
    fetchReply: true,
  });

  // Currently set to "<:UpVote:718281782813786154>" on BFD
  const reaction = interaction.guild?.emojis.cache.get("718281782813786154");
  if (reaction) msg.react(reaction);

  // Start thread, fetch experience, and post if found
  msg
    .startThread({
      name: experienceName,
      autoArchiveDuration: 1440,
      reason: "Auto-created thread for Portal Experience sharing post.",
    })
    .then(async (thread) => {
      const experienceApiURL = new URL("https://api.gametools.network/bf2042/playground");
      experienceApiURL.searchParams.set("experiencecode", experienceCode);
      experienceApiURL.searchParams.set("blockydata", "false");

      const res = await fetch(experienceApiURL.href, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });

      if (!res.ok) return;
      const json = (await res.json()) as any;

      const playground = json.originalPlayground;
      const tags = json.tag;

      let mapRotationNumber = 0;
      const experienceEmbed = {
        color: resolveColor("#26ffdf"),
        title: `Portal Experience: ${escapeMarkdown(playground.playgroundName)}`,
        footer: {
          text: `${interaction.client.user.username} - By Mozzy#9999 - Experience info provided by Game Tools - Not affiliated with EA/DICE`,
          iconURL: interaction.client.user.avatarURL(),
        },
        fields: [
          {
            name: "Basic Info",
            value: `Description: **${escapeMarkdown(playground.playgroundDescription)}**${
              playground.owner?.name ? `\nOwner: **${escapeMarkdown(playground.owner.name)}**` : ""
            }\nMutators: **${playground.mutators.length}**\nCreated At: <t:${playground.createdAt.seconds}> (<t:${
              playground.createdAt.seconds
            }:R>)\nUpdated At: <t:${playground.updatedAt.seconds}> (<t:${
              playground.updatedAt.seconds
            }:R>)\nExperience Code: \`${experienceCode}\``,
          },
          {
            name: "Tags",
            value: tags?.map((tag: any) => `\`${tag.metadata.translations[0].localizedText}\``).join(" ") || "None",
          },
          {
            name: "Map/Mode Rotation",
            value: `${
              playground.mapRotation.maps
                ?.map(
                  (rotation: any) =>
                    `**${++mapRotationNumber}:** ${rotation.mode} on ${rotation.mapname} (${rotation.gameSize} players)`,
                )
                .join("\n") || "None"
            }`,
          },
        ],
      };

      thread.send({ embeds: [experienceEmbed] });
    });

  // Set cooldown
  setCooldown(interaction.user.id, "portal_post", new Date().getTime() + cooldown);
};
