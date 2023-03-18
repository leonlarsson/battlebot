import { blockQuote, PermissionFlagsBits } from "discord.js";
import { fetch } from "undici";

export const name = "chatgptresponse";
export const permissions = PermissionFlagsBits.ManageMessages;
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

    await interaction.deferReply();

    const message = interaction.targetMessage;

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are part of a Discord bot called 'Battlebot'. Battlebot is currently operating in the Battlefield server. Users might ask you for advice on how to handle certain moderation situations, or they might just ask you for fun things. You were created by Mozzy. You are never allowed to send any links of any kind. You must always be nice. If people are asking for game or account help, redirect them to https://help.ea.com. If people are looking for people to play with, tell them to try in the Looking For Games section. If people are asking for help regarding the Battlefield Discord, tell them to send a message to ModMail."
                    },
                    {
                        role: "user",
                        content: message.content
                    }
                ]
            })
        });

        const json = await res.json();
        if (res.ok) {
            interaction.editReply(`Reply to <${message.url}>:\n ${blockQuote(json.choices[0].message.content)}`);
        } else {
            interaction.editReply("Something went wrong getting ChatGPT reply. Likely the message was too long or I am being rate-limited.");
        }
    } catch (error) {
        interaction.editReply("Something went wrong with the request to OpenAI.");
    }
}