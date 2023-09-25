import { ChatInputCommandInteraction, blockQuote } from "discord.js";
import { connect } from "@planetscale/database";

const conn = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
});

export const name = "chatgptresponse";
export const isPublic = true;
export const enabled = true;
/**
 * @param {ChatInputCommandInteraction} interaction 
 */
export async function execute(interaction) {

    await interaction.deferReply();

    const targetMessage = interaction.targetMessage;

    const serverRules = [
        "No content such as spam, invite links, trading, selling, begging, surveys, petitions, self promotion, url shortened links, advertising & referral links.",
        "Do not harass other users, impersonate users, abuse spoiler tags or discuss cheats.",
        "Do not post content or express your viewpoints for content that is: political, abusive, threatening, defamatory, racial, sexual or religious.",
    ];

    const { rows: recentMessages } = await conn.execute("SELECT author, content FROM battlebot_messages ORDER BY timestamp DESC LIMIT 10");

    // Add the system message to the conversation
    // Then add the recent messages
    // Then add the most recent message
    const conversation = [
        {
            role: "system",
            content: `Multiple users will be talking to you. Their name will be mentioned ion front of their message. Today's date is ${new Date(new Date().setFullYear(2042)).toUTCString()}. You are a Discord bot called 'Battlebot', but don't repeat that in messages. Battlebot is currently operating in the Battlefield server. Users might ask you for advice on how to handle certain moderation situations, or they might just ask you for fun things. You were created by Mozzy. You are never allowed to send any links of any kind. You must always be nice. If people are asking for game or account help, redirect them to https://help.ea.com. If people are looking for people to play with, tell them to try in the Looking For Games section. If people are asking for help regarding the Battlefield Discord, tell them to send a message to ModMail. Do not ever discuss or mention politics. Only respond to messages that are related to Battlefield or the Discord. Feel free to use this name in your response. Here are the server rules: ${serverRules.join(", ")}. Mention the rules if needed. All the rules can be found in #rules. The Battlefield Stats Discord bot delivers stats inside Discord. It can be found at https://battlefieldstats.com.`
        },
        ...recentMessages.reverse().map(msg => {
            return {
                role: msg.author === "ChatGPT" ? "system" : "user",
                content: msg.content
            };
        }),
        {
            role: "user",
            content: `Message from ${targetMessage.author.displayName}: ${targetMessage.content}`
        },
    ];

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversation
            })
        });

        if (res.ok) {
            const json = await res.json();
            try {
                await interaction.editReply(`ChatGPT's reply to <${targetMessage.url}>:\n ${blockQuote(json.choices[0].message.content)}`);

                // If not in #general, #battlefield-2042, or #bot-dev, don't save the messages
                if (!["140933721929940992", "850376380822323230", "845402419038650418"].includes(interaction.channelId)) return;
                await conn.execute("INSERT INTO battlebot_messages (author, content, timestamp) VALUES (?, ?, ?), (?, ?, ?)", [targetMessage.author.displayName, targetMessage.content, new Date().valueOf().toString(), "ChatGPT", json.choices[0].message.content, (new Date().valueOf() + 1000).toString()]);
            } catch (error) {
                interaction.editReply("Sorry, the response was probably too long.");
            }
        } else {
            interaction.editReply("Something went wrong getting ChatGPT reply. Likely the message was too long or I am being rate-limited.");
        }
    } catch (error) {
        console.log(error);
        interaction.editReply("Something went wrong with the request to OpenAI.");
    }
}