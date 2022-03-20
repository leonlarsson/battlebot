import { updateOrAddCooldown } from "../../utils/handleCooldowns.js";
import cleanMessage from "../../utils/cleanMessage.js";

export const name = "portal_post";
export const allowed_channels = ["908101543646089236"];
export const wrong_channel_message = "This is only available in <#908101543646089236>";
export const cooldown = 43200000; // ms: 12 hours
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {
    // Lock to me only
    // if (interaction.user.id !== "99182302885588992") return interaction.reply({ content: "No.", ephemeral: true });

    // Removing embeds on links and censor invite links
    const name = cleanMessage(interaction.options.getString("name"));
    const description = cleanMessage(interaction.options.getString("description"));
    const experienceCode = cleanMessage(interaction.options.getString("experience_code"));

    // Check length
    if (name.length > 150) return interaction.reply({ content: `\`Name\` needs to be 150 characters or less. You were at ${name.length}.`, ephemeral: true });
    if (description.length > 600) return interaction.reply({ content: `\`Description\` needs to be 600 characters or less. You were at ${description.length}.`, ephemeral: true });
    if (experienceCode.length > 50) return interaction.reply({ content: `\`Experience Code\` needs to be 50 characters or less. You were at ${experienceCode.length}.`, ephemeral: true });

    // Check newlines
    if (name.includes("\n") || description.includes("\n") || experienceCode.includes("\n"))
        return interaction.reply({ content: "Your message cannot contain any linebreaks. Keep it all on one line and try again.", ephemeral: true });

    const msg = await interaction.reply({ content: `*Portal Experience sharing post from ${interaction.user.tag} <@${interaction.user.id}>*\n**Experience Name**: ${name}\n**Experience Description**: ${description}\n**Experience Code**: ${experienceCode}\n`, allowedMentions: { users: [interaction.user.id] }, fetchReply: true });

    // Currently set to "<:UpVote:718281782813786154>" on BFD
    msg.react(interaction.guild.emojis.cache.get("718281782813786154"));

    msg.startThread({
        name: name,
        autoArchiveDuration: 1440,
        reason: "Auto-created thread for Portal Experience sharing post."
    });

    updateOrAddCooldown(interaction, this);
}