export const name = "messageCreate";
export function execute(message) {

	const directCommChannel = "908502197170503740";
	const webhookId = "1113160068171575297";

	if (message.channelId === directCommChannel && message.webhookId === webhookId) {
		console.log(`Auto-publishing new post in ${message.channel.name}`);
		message.crosspost();
	}
}