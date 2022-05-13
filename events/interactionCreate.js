import HumanizeDuration from "humanize-duration";
import { handlePortalModal } from "../commands/portal/portal_post.js";
import { handleRecruitmentModal } from "../commands/recruitment/recruitment_post.js";
import { checkIfCooldownExpired, getCooldownQuery } from "../utils/handleCooldowns.js";

export const name = "interactionCreate";
export async function execute(interaction, client) {

    // Handle the modal interactions
    if (interaction.isModalSubmit()) {
        if (interaction.customId === "portalModal") return handlePortalModal(interaction);
        if (interaction.customId === "recruitmentModal") return handleRecruitmentModal(interaction);
    }

    if (!interaction.isCommand() && !interaction.isContextMenu()) return;

    // Define command used
    let commandUsed;
    if (interaction.commandName === "Show userinfo") commandUsed = "userinfo";

    if (interaction.commandName === "when") commandUsed = "when";

    if (interaction.commandName === "fnb") {
        if (interaction.options.getSubcommand() === "category") commandUsed = "fnb_category";
        if (interaction.options.getSubcommand() === "create_event") commandUsed = "fnb_create_event";
        if (interaction.options.getSubcommand() === "info") commandUsed = "fnb_info";
    }

    if (interaction.commandName === "portal") {
        if (interaction.options.getSubcommand() === "post") commandUsed = "portal_post";
        if (interaction.options.getSubcommand() === "cooldown") commandUsed = "portal_cooldown";
    }

    if (interaction.commandName === "recruitment") {
        if (interaction.options.getSubcommand() === "post") commandUsed = "recruitment_post";
        if (interaction.options.getSubcommand() === "cooldown") commandUsed = "recruitment_cooldown";
    }

    // Get command and check if valid
    const command = await client.commands.get(commandUsed);
    if (!command) return interaction.reply({ content: "Not a valid command.", ephemeral: true });

    // Public/enabled checks
    if (command.enabled === false) return interaction.reply({ content: "Command is disabled.", ephemeral: true });
    if (command.isPublic === false && interaction.user.id !== "99182302885588992") return interaction.reply({ content: "Command is not available.", ephemeral: true });

    // Perm check
    if (command.permissions) {
        const authorPerms = interaction.channel.permissionsFor(interaction.user);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return interaction.reply({ content: "You don't have permission to run this.", ephemeral: true });
        }
    }

    // Check for valid channel(s)
    if (command.allowed_channels) {
        // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
        if (!command.allowed_channels.includes(interaction.channel.id) && interaction.user.id !== "99182302885588992") {
            return interaction.reply({ content: command.wrong_channel_message, ephemeral: true });
        }
    }

    // Check cooldown. If there is a cooldown and it hasn't expired, return and notify
    if (command.cooldown) {
        const cooldown = await getCooldownQuery(interaction, command);
        if (cooldown) {
            const { expired, expiresIn } = await checkIfCooldownExpired(cooldown);
            if (!expired) return interaction.reply({ content: `Please wait \`${HumanizeDuration(expiresIn, { round: true, conjunction: " and " })}\` before using this command again.`, ephemeral: true });
        }
    }

    // Run command
    command.execute(interaction, client);
}