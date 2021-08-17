module.exports = {
    name: "battlebot-deploy",
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
                                name: "Game Release",
                                value: "release"
                            },
                            {
                                name: "Game Release (Gold/Ultimate)",
                                value: "early_release"
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
            },
            {
                name: "recruitment",
                description: "Create a recruitment post.",
                options: [
                    {
                        name: "name",
                        description: "Your platoon/community name.",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "platform",
                        description: "The platform(s) you play on. (PC, Xbox & PlayStation)",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "game",
                        description: "The Battlefield game(s) you play.",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "region",
                        description: "The region(s) you play in. (EU, NA, etc.)",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "description",
                        description: "A brief description of your platoon/community.",
                        type: "STRING",
                        required: true
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