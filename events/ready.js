import { startFNBEventCronJob } from "../utils/createFNBEvent.js";
import { startFNBCategoryCronJobs } from "../utils/moveFNBCategory.js";

export const name = "ready";
export const once = true;
export function execute(client) {
	console.log(`Logged in and ready as ${client.user.tag} - Environment: ${process.env.ENVIRONMENT}`);
	client.user.setPresence({
		status: "online",
		activities: [
			{
				type: "PLAYING",
				name: "Battlefield"
			}
		]
	});

	// Start crons for FNB
	startFNBEventCronJob(client);
	startFNBCategoryCronJobs(client);
}
