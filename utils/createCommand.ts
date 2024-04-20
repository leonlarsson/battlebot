import type { Command } from "@/types";
import type { ChatInputCommandInteraction } from "discord.js";

export default <T = ChatInputCommandInteraction>(props: Command<T>): Command<T> => props;
