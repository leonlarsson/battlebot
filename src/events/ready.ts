import { ActivityType, Events } from "discord.js";
import createEvent from "#utils/createEvent.ts";
import { startFNBCategoryCronJobs } from "#utils/moveFNBCategory.ts";

export default createEvent({
  name: Events.ClientReady,
  once: true,
  execute: (client) => {
    console.log(`Logged in and ready as ${client.user?.tag} - Environment: ${process.env.ENVIRONMENT}`);
    client.user?.setActivity({
      name: "Battlefield",
      type: ActivityType.Playing,
    });

    // Start crons for FNB
    startFNBCategoryCronJobs(client);
  },
});
