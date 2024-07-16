import type { BaseInteraction } from "discord.js";

export default (interaction: BaseInteraction): string | null => {
  // If interaction is a context menu command, return the command name
  if (interaction.isContextMenuCommand()) {
    return interaction.commandName;
  }

  // If interaction is a chat input command, return the command name and subcommand
  if (interaction.isChatInputCommand() && /fnb|portal|recruitment|admin/.test(interaction.commandName)) {
    return `${interaction.commandName}_${interaction.options.getSubcommand()}`;
  }

  if (interaction.isChatInputCommand()) {
    return interaction.commandName;
  }

  return null;
};
