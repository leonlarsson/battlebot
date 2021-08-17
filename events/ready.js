const Discord = require('discord.js');

module.exports = {
	name: 'ready',
	once: false,
	execute(client) {
		console.log(`Logged in and ready as ${client.user.tag}`);
		client.user.setPresence({
			status: "online",
			activities: [
				{
					type: "PLAYING",
					name: "Battlefield"
				}
			]
		})

		// setInterval(() => {
		// 	client.commands.get("countdown").execute(1, 2, client, Discord);
		// }, 21600000);
	}
};
