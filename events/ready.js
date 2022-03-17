import { environment } from "../config.js";
import createFNBEvent from "../utils/createFNBEvent.js";

export const name = "ready";
export const once = true;
export function execute(client) {
	console.log(`Logged in and ready as ${client.user.tag} - Environment: ${environment}`);
	client.user.setPresence({
		status: "online",
		activities: [
			{
				type: "PLAYING",
				name: "Battlefield"
			}
		]
	});

	// Start cron to create FNB event
	createFNBEvent(client);
}
