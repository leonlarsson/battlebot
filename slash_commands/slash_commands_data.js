module.exports = [

    // When/countdown command
    {
        name: "when",
        description: "Displays a countdown to an upcoming Battlefield event.",
        default_permission: false,
        options: [
            {
                name: "event",
                description: "The event to show a countdown to.",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "Event Name",
                        value: "event_name"
                    }
                ]
            }
        ]
    },

    // FNB categpry move command
    {
        name: "fnb",
        description: "Activate or deactivate the FNB category.",
        options: [
            {
                name: "action",
                description: "Whether to deactivate (move down) or activate (move up) the FNB category.",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "Activate (Move up)",
                        value: "activate",
                    },
                    {
                        name: "Deactivate (Move down)",
                        value: "deactivate",
                    },
                ]
            }
        ]
    },

    // Portal experience command

    {
        name: "portal",
        description: "Post about your Portal Experience.",
        options: [
            {
                name: "post",
                description: "Share your Portal Experience.",
                type: 1,
                options: [
                    {

                        name: "name",
                        description: "Your Portal Experience name.",
                        type: 3,
                        required: true,
                    },
                    {
                        name: "description",
                        description: "A description of your Portal Experience.",
                        type: 3,
                        required: true
                    },
                    {
                        name: "experience_code",
                        description: "Your Portal Experience Code.",
                        type: 3,
                        required: true
                    }
                ]
            },

            // Portal sharing cooldown action
            {
                name: "cooldown",
                description: "Cooldown actions for Portal sharing.",
                type: 1,
                options: [
                    {
                        name: "user",
                        description: "The user to see cooldown of.",
                        type: 6,
                        required: true
                    }
                ]
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
                description: "Post a recruitment post.",
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
                description: "Cooldown actions for recruitment posts.",
                type: 1,
                options: [
                    {
                        name: "user",
                        description: "The user to see cooldown of.",
                        type: 6,
                        required: true
                    }
                ]
            }
        ]
    },

    // Context menus

    // Show userinfo
    {
        name: "Show userinfo",
        type: 2
    }
]