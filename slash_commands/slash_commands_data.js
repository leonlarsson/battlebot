module.exports = [

    // When/countdown command
    {
        name: "when",
        description: "Displays a countdown to an upcoming Battlefield event.",
        options: [
            {
                name: "event",
                description: "The event to show a countdown to.",
                type: 3,
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
                type: 3,
                required: false
            }
        ]
    },

    // Recruitment commands
    {
        name: "recruitment",
        description: "Create a recruitment post.",
        options: [
            {
                name: "post",
                description: "Build and post a recruitment post.",
                type: 1,
                options: [
                    {
                        name: "name",
                        description: "Your platoon/community name.",
                        type: 3,
                        required: true,
                    },
                    {
                        name: "platform",
                        description: "The platform(s) you play on. (PC, Xbox & PlayStation)",
                        type: 3,
                        required: true
                    },
                    {
                        name: "game",
                        description: "The Battlefield game(s) you play.",
                        type: 3,
                        required: true
                    },
                    {
                        name: "region",
                        description: "The region(s) you play in. (EU, NA, etc.)",
                        type: 3,
                        required: true
                    },
                    {
                        name: "description",
                        description: "A brief description of your platoon/community.",
                        type: 3,
                        required: true
                    },
                ]
            },

            // Recruitment cooldown clear / view
            {
                name: "cooldown",
                description: "Cooldown actions for recruitment.",
                type: 2,
                options: [
                    {
                        name: "clear",
                        description: "Clear a user's cooldown. (Admin only).",
                        type: 1,
                        options: [
                            {
                                name: "user",
                                description: "The user to clear cooldown of.",
                                type: 6,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "view",
                        description: "View a user's cooldown. Also allows clearing. (Admin only).",
                        type: 1,
                        options: [
                            {
                                name: "user",
                                description: "The user to view cooldown of.",
                                type: 6,
                                required: true
                            }
                        ]
                    }
                ]
            },
        ]
    },

    // Context menus

    // Show userinfo
    {
        name: "Show userinfo",
        type: 2
    },

    // Clear recruitment cooldown
    {
        name: "Clear recr. cooldown",
        type: 2
    }
]