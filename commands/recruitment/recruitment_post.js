// eslint-disable-next-line no-unused-vars
import { ModalSubmitInteraction, Modal, MessageActionRow, TextInputComponent } from "discord.js";
import { updateOrAddCooldown } from "../../utils/handleCooldowns.js";
import cleanMessage from "../../utils/cleanMessage.js";

export const name = "recruitment_post";
export const allowed_channels = ["739938247089848351"];
export const wrong_channel_message = "This is only available in <#739938247089848351>";
export const cooldown = 172800000; // ms: 48 hours
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

    // Build the text inputs
    const recruitmentNameInput = new TextInputComponent()
        .setCustomId("recruitmentNameInput")
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(50)
        .setStyle("SHORT")
        .setLabel("Name:")
        .setPlaceholder("Mozzy's Cool Clan");

    const recruitmentPlatformInput = new TextInputComponent()
        .setCustomId("recruitmentPlatformInput")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(50)
        .setStyle("SHORT")
        .setLabel("Platform(s):")
        .setPlaceholder("PC and PlayStation");

    const recruitmentGameInput = new TextInputComponent()
        .setCustomId("recruitmentGameInput")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(70)
        .setStyle("SHORT")
        .setLabel("Game(s):")
        .setPlaceholder("Battlefield 1 only");

    const recruitmentRegionInput = new TextInputComponent()
        .setCustomId("recruitmentRegionInput")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(50)
        .setStyle("SHORT")
        .setLabel("Region(s):")
        .setPlaceholder("All regions - Mr. Worldwide!");

    const recruitmentDescriptionInput = new TextInputComponent()
        .setCustomId("recruitmentDescriptionInput")
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(400)
        .setStyle("PARAGRAPH")
        .setLabel("Description (NO LINEBREAKS):")
        .setPlaceholder("This is an absolutely amazing clan. No linebreaks allowed.");

    // Create action rows
    const recruitmentModalActionRow1 = new MessageActionRow().addComponents(recruitmentNameInput);
    const recruitmentModalActionRow2 = new MessageActionRow().addComponents(recruitmentPlatformInput);
    const recruitmentModalActionRow3 = new MessageActionRow().addComponents(recruitmentGameInput);
    const recruitmentModalActionRow4 = new MessageActionRow().addComponents(recruitmentRegionInput);
    const recruitmentModalActionRow5 = new MessageActionRow().addComponents(recruitmentDescriptionInput);

    // Build modal
    const recruitmentModal = new Modal()
        .setCustomId("recruitmentModal")
        .setTitle("Share Your Recruitment Post")
        .addComponents(recruitmentModalActionRow1, recruitmentModalActionRow2, recruitmentModalActionRow3, recruitmentModalActionRow4, recruitmentModalActionRow5);

    // Show modal
    interaction.showModal(recruitmentModal);

}

/**
 * Handles the Recruitment modal submission.
 * @param {ModalSubmitInteraction} interaction The modal submit interaction.
 */
export const handleRecruitmentModal = async interaction => {

    // Removing embeds on links and censor invite links
    const recruitmentName = cleanMessage(interaction.fields.getTextInputValue("recruitmentNameInput"));
    const recruitmentPlatform = cleanMessage(interaction.fields.getTextInputValue("recruitmentPlatformInput"));
    const recruitmentGame = cleanMessage(interaction.fields.getTextInputValue("recruitmentGameInput"));
    const recruitmRegion = cleanMessage(interaction.fields.getTextInputValue("recruitmentRegionInput"));
    const recruitmentDescription = cleanMessage(interaction.fields.getTextInputValue("recruitmentDescriptionInput"));

    // Check newlines, and inform the user if there are newlines
    if (recruitmentName.includes("\n") || recruitmentPlatform.includes("\n") || recruitmentGame.includes("\n") || recruitmRegion.includes("\n") || recruitmentDescription.includes("\n"))
        return interaction.reply({ content: `Your message cannot contain any linebreaks.\n**Name**: ${recruitmentName}\n**Platform(s)**: ${recruitmentPlatform}\n**Game(s)**: ${recruitmentGame}\n**Region(s)**: ${recruitmRegion}\n**Description**: ${recruitmentDescription}`, ephemeral: true });

    interaction.reply({ content: `*Recruitment post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Name**: ${recruitmentName}\n**Platform(s)**: ${recruitmentPlatform}\n**Game(s)**: ${recruitmentGame}\n**Region(s)**: ${recruitmRegion}\n**Description**: ${recruitmentDescription}`, allowedMentions: { users: [interaction.user.id] } });

    updateOrAddCooldown(interaction, { name, cooldown });
};