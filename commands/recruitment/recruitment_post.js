import { updateOrAddCooldown } from "../../utils/handleCooldowns.js";
import cleanMessage from "../../utils/cleanMessage.js";

export const name = "recruitment_post";
export const allowed_channels = ["739938247089848351"];
export const wrong_channel_message = "This is only available in <#739938247089848351>";
export const cooldown = 172800000; // ms: 48 hours
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {
    // Lock to me only
    // if (interaction.user.id !== "99182302885588992") return interaction.reply({ content: "No.", ephemeral: true });

    // Removing embeds on links and censor invite links
    const name = cleanMessage(interaction.options.getString("name"));
    const description = cleanMessage(interaction.options.getString("description"));
    const platform = cleanMessage(interaction.options.getString("platform"));
    const game = cleanMessage(interaction.options.getString("game"));
    const region = cleanMessage(interaction.options.getString("region"));

    // Check length
    if (name.length > 50) return interaction.reply({ content: `\`Name\` needs to be 50 characters or less. You were at ${name.length}.`, ephemeral: true });
    if (description.length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${description.length}.`, ephemeral: true });
    if (platform.length > 50) return interaction.reply({ content: `\`Platform\` needs to be 50 characters or less. You were at ${platform.length}.`, ephemeral: true });
    if (game.length > 70) return interaction.reply({ content: `\`Game\` needs to be 70 characters or less. You were at ${game.length}.`, ephemeral: true });
    if (region.length > 50) return interaction.reply({ content: `\`Region\` needs to be 50 characters or less. You were at ${region.length}.`, ephemeral: true });

    // Check newlines
    if (name.includes("\n") || description.includes("\n") || platform.includes("\n") || game.includes("\n") || region.includes("\n"))
        return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

    interaction.reply({ content: `*Recruitment post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Name**: ${name}\n**Platform(s)**: ${platform}\n**Game(s)**: ${game}\n**Region(s)**: ${region}\n**Description**: ${description}`, allowedMentions: { users: [interaction.user.id] } });

    updateOrAddCooldown(interaction, this);
}