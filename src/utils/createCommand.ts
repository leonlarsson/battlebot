import type { ChatInputCommandInteraction } from "discord.js";
import type { Command } from "#types.js";

export default <T = ChatInputCommandInteraction>(props: Command<T>): Command<T> => props;
