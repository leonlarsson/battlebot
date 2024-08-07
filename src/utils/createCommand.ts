import type { ChatInputCommandInteraction } from "discord.js";
import type { Command } from "#types.ts";

export default <T = ChatInputCommandInteraction>(props: Command<T>): Command<T> => props;
