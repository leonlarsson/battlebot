import { ActivityType, Client, Events } from "discord.js";
import type { Event } from "../types";

export default {
  name: Events.ClientReady,
  execute: (client: Client) => {
    console.log(
      `Logged in and ready as ${client.user?.tag} - Environment: ${process.env.ENVIRONMENT}`
    );

    client.user?.setActivity({
      name: "Battlefield",
      type: ActivityType.Playing,
    });
  },
} satisfies Event;
