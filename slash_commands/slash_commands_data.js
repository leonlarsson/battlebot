import { ApplicationCommandType, ApplicationCommandOptionType } from "discord-api-types/v9"

export default [

    // When/countdown command
    {
        name: "when",
        description: "Displays a countdown to an upcoming Battlefield event.",
        default_permission: false,
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "event",
                description: "The event to show a countdown to.",
                type: ApplicationCommandOptionType.String,
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
        description: "FNB Commands.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "category",
                description: "[ADMIN] Activate or deactivate the FNB category.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "action",
                        description: "Whether to deactivate (move down) or activate (move up) the FNB category.",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            {
                                name: "Activate (Move up)",
                                value: "activate"
                            },
                            {
                                name: "Deactivate (Move down)",
                                value: "deactivate"
                            }
                        ]
                    }
                ]
            },
            {
                name: "create_event",
                description: "[ADMIN] Manually creates an FNB event. Use only if the automated one fails.",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "info",
                description: "What is FNB?",
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },

    // Portal experience command
    {
        name: "portal",
        description: "Portal Experience sharing commands.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "post",
                description: "Share your Portal Experience.",
                type: ApplicationCommandOptionType.Subcommand
            },

            // Portal sharing cooldown action
            {
                name: "cooldown",
                description: "[ADMIN] Cooldown actions for Portal sharing.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "The user to see cooldown of.",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            }
        ]
    },

    // Recruitment commands
    {
        name: "recruitment",
        description: "Recruitment commands.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "post",
                description: "Post a recruitment post.",
                type: ApplicationCommandOptionType.Subcommand
            },

            // Recruitment cooldown clear / view
            {
                name: "cooldown",
                description: "[ADMIN] Cooldown actions for recruitment posts.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "The user to see cooldown of.",
                        type: ApplicationCommandOptionType.User,
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
        type: ApplicationCommandType.User
    }
]