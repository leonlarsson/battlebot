// eslint-disable-next-line no-unused-vars
import { ModalSubmitInteraction, ComponentType, TextInputStyle, escapeMarkdown, resolveColor } from "discord.js";
import { updateOrAddCooldown } from "../../utils/handleCooldowns.js";
import cleanMessage from "../../utils/cleanMessage.js";

export const name = "portal_post";
export const allowed_channels = ["908101543646089236"];
export const wrong_channel_message = "This is only available in <#908101543646089236>";
export const cooldown = 43_200_000; // ms: 12 hours
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

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
                        placeholder: "AATCVC"
                    }
                ]
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
                        placeholder: "Mozzy's 24/7 Nosehair Canals TDM"
                    }
                ]
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
                        placeholder: "This is an absolutely amazing experience. No linebreaks allowed."
                    }
                ]
            }
        ]
    };

    // Show modal
    interaction.showModal(portalModal);
}

/**
 * Handles the Portal modal submission.
 * @param {ModalSubmitInteraction} interaction The modal submit interaction.
 */
export const handlePortalModal = async interaction => {

    const experienceCode = interaction.fields.getTextInputValue("portalExperienceCodeInput");
    const experienceName = interaction.fields.getTextInputValue("portalNameInput");
    const experienceDescription = interaction.fields.getTextInputValue("portalDescriptionInput");

    // Check newlines, and inform the user if there are newlines
    if (experienceName.includes("\n") || experienceCode.includes("\n") || experienceDescription.includes("\n"))
        return interaction.reply({ content: `Your message cannot contain any linebreaks.\n\n**Experience Code**: ${experienceCode}\n**Name**: ${experienceName}\n**Description**: ${experienceDescription}`, ephemeral: true });

    const msg = await interaction.reply({ content: `*Portal Experience sharing post from ${interaction.user.username} <@${interaction.user.id}>*\n**Experience Code**: ${cleanMessage(experienceCode)}\n**Experience Name**: ${cleanMessage(experienceName)}\n**Experience Description**: ${cleanMessage(experienceDescription)}`, allowedMentions: { users: [interaction.user.id] }, fetchReply: true });

    // Currently set to "<:UpVote:718281782813786154>" on BFD
    const reaction = interaction.guild.emojis.cache.get("718281782813786154");
    if (reaction) msg.react(reaction);

    // Start thread, fetch experience, and post if found
    msg.startThread({
        name: experienceName,
        autoArchiveDuration: 1440,
        reason: "Auto-created thread for Portal Experience sharing post."
    }).then(async thread => {

        const experienceApiURL = new URL("https://api.gametools.network/bf2042/playground");
        experienceApiURL.searchParams.set("experiencecode", experienceCode);
        experienceApiURL.searchParams.set("blockydata", false);

        const res = await fetch(experienceApiURL.href, {
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip"
            }
        }).catch(() => { });

        if (!res.ok) return;
        const json = await res.json();

        const playground = json.originalPlayground;
        const tags = json.tag;

        let mapRotationNumber = 0;
        const experienceEmbed = {
            color: resolveColor("#26ffdf"),
            title: `Portal Experience: ${escapeMarkdown(playground.playgroundName)}`,
            footer: { text: `${interaction.client.user.username} - By Mozzy#9999 - Experience info provided by Game Tools - Not affiliated with EA/DICE`, iconURL: interaction.client.user.avatarURL() },
            fields: [
                { name: "Basic Info", value: `Description: **${escapeMarkdown(playground.playgroundDescription)}**${playground.owner?.name ? `\nOwner: **${escapeMarkdown(playground.owner.name)}**` : ""}\nMutators: **${playground.mutators.length}**\nCreated At: <t:${playground.createdAt.seconds}> (<t:${playground.createdAt.seconds}:R>)\nUpdated At: <t:${playground.updatedAt.seconds}> (<t:${playground.updatedAt.seconds}:R>)\nExperience Code: \`${experienceCode}\`` },
                { name: "Tags", value: tags?.map(tag => `\`${tag.metadata.translations[0].localizedText}\``).join(" ") || "None" },
                { name: "Map/Mode Rotation", value: `${playground.mapRotation.maps?.map(rotation => `**${++mapRotationNumber}:** ${rotation.mode} on ${rotation.mapname} (${rotation.gameSize} players)`).join("\n") || "None"}` }
            ]
        };

        thread.send({ embeds: [experienceEmbed] });
    });

    updateOrAddCooldown(interaction, { name, cooldown });
};