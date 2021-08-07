module.exports = {
    name: "countdown-deploy",
    cooldown: 5,
    public: false,
    async execute(message, args, client) {

        const slashCommandsData = [
            {
                name: "when",
                description: "Displays a countdown to the Exodus short film.",
                options: [
                    {
                        name: "text",
                        type: "STRING",
                        description: "When <what>",
                        required: false
                    }
                ]
            }
        ]

        await client.guilds.cache.get("140933721929940992")?.commands.set(slashCommandsData)
            .then(() => {
                console.log("Slash Commands Deployed.");
                message.reply("Slash Commands Deployed.");
            })

    }
};