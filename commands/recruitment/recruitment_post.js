// eslint-disable-next-line no-unused-vars
import { ModalSubmitInteraction, ComponentType, TextInputStyle } from "discord.js";
import { updateOrAddCooldown } from "../../utils/handleCooldowns.js";
import cleanMessage from "../../utils/cleanMessage.js";

export const name = "recruitment_post";
export const allowed_channels = ["739938247089848351"];
export const wrong_channel_message = "This is only available in <#739938247089848351>";
export const cooldown = 172800000; // ms: 48 hours
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

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
                        placeholder: "Mozzy's Cool Clan"
                    }
                ]
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
                        placeholder: "PC and PlayStation"
                    }
                ]
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
                        placeholder: "Battlefield 1 only (GOTY!)"
                    }
                ]
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
                        placeholder: "All regions - Mr. Worldwide!"
                    }
                ]
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
                        placeholder: "This is an absolutely amazing clan. No linebreaks allowed."
                    }
                ]
            }
        ]
    };

    // Show modal
    interaction.showModal(recruitmentModal);

}

/**
 * Handles the Recruitment modal submission.
 * @param {ModalSubmitInteraction} interaction The modal submit interaction.
 */
export const handleRecruitmentModal = async interaction => {

    // Removing embeds on links and censor invite links
    const recruitmentName = interaction.fields.getTextInputValue("recruitmentNameInput");
    const recruitmentPlatform = interaction.fields.getTextInputValue("recruitmentPlatformInput");
    const recruitmentGame = interaction.fields.getTextInputValue("recruitmentGameInput");
    const recruitmRegion = interaction.fields.getTextInputValue("recruitmentRegionInput");
    const recruitmentDescription = interaction.fields.getTextInputValue("recruitmentDescriptionInput");

    // Check newlines, and inform the user if there are newlines
    if (recruitmentName.includes("\n") || recruitmentPlatform.includes("\n") || recruitmentGame.includes("\n") || recruitmRegion.includes("\n") || recruitmentDescription.includes("\n"))
        return interaction.reply({ content: `Your message cannot contain any linebreaks.\n**Name**: ${recruitmentName}\n**Platform(s)**: ${recruitmentPlatform}\n**Game(s)**: ${recruitmentGame}\n**Region(s)**: ${recruitmRegion}\n**Description**: ${recruitmentDescription}`, ephemeral: true });

    interaction.reply({ content: `*Recruitment post from ${interaction.user.username} <@${interaction.user.id}>*\n**Name**: ${cleanMessage(recruitmentName)}\n**Platform(s)**: ${cleanMessage(recruitmentPlatform)}\n**Game(s)**: ${cleanMessage(recruitmentGame)}\n**Region(s)**: ${cleanMessage(recruitmRegion)}\n**Description**: ${cleanMessage(recruitmentDescription)}`, allowedMentions: { users: [interaction.user.id] } });

    updateOrAddCooldown(interaction, { name, cooldown });
};