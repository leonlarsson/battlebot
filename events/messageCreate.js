export const name = "messageCreate";
export function execute(message) {

	const directCommChannel = "908502197170503740";
	const webhookId = "908413039118794793";

	if (message.channelId === directCommChannel && message.webhookId === webhookId) {
		console.log(`Auto-publishing new post in ${message.channel.name}`);
		message.crosspost();
	}
}