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
                        name: "event",
                        description: "The event to show a countdown to.",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Exodus Short Film",
                                value: "exodus"
                            },
                            {
                                name: "Game Release",
                                value: "release"
                            }
                        ],
                    },
                    {
                        name: "text",
                        description: "When <what> || (Only Mozzy)",
                        type: "STRING",
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