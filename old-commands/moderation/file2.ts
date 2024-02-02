import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import type { Command } from "../../types";

export default {
  name: "othercommand",
  requiredPermissions: [PermissionFlagsBits.ManageMessages],
  enabled: true,
  isPublic: true,
  execute: async (_client, interaction: ChatInputCommandInteraction) => {
    interaction.reply({ content: "Other command", ephemeral: true });
  },
} satisfies Command;
