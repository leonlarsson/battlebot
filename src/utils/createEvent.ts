import type { ClientEvents } from "discord.js";
import type { Event } from "#types.ts";

export default <TEventName extends keyof ClientEvents>(event: Event<TEventName>): Event<TEventName> => event;
