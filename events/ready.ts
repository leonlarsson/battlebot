import { ActivityType, Client, Events } from "discord.js";
import createEvent from "@/utils/createEvent";

export default createEvent({
  name: Events.ClientReady,
  execute: (client: Client) => {
    console.log(`Logged in and ready as ${client.user?.tag} - Environment: ${process.env.ENVIRONMENT}`);

    client.user?.setActivity({
      name: "Battlefield",
      type: ActivityType.Playing,
    });
  },
});
