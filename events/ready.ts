import { ActivityType, Events } from "discord.js";
import createEvent from "@/utils/createEvent";

export default createEvent({
  name: Events.ClientReady,
  once: true,
  execute: client => {
    console.log(`Logged in and ready as ${client.user?.tag} - Environment: ${process.env.ENVIRONMENT}`);
    client.user?.setActivity({
      name: "Battlefield",
      type: ActivityType.Playing,
    });
  },
});
