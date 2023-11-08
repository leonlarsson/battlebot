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

    // If not in ChadGPT thread or #bot-dev, refuse
    if (!["1156306367775264808", "845402419038650418"].includes(interaction.channelId)) return interaction.reply({content: "This command can only be used in <#1156306367775264808>.", ephemeral: true});

    await interaction.deferReply();

    const targetMessage = interaction.targetMessage;

    const serverRules = [
        "No content such as spam, invite links, trading, selling, begging, surveys, petitions, self promotion, url shortened links, advertising & referral links.",
        "Do not harass other users, impersonate users, abuse spoiler tags or discuss cheats.",
        "Do not post content or express your viewpoints for content that is: political, abusive, threatening, defamatory, racial, sexual or religious.",
    ];

    const { rows: recentMessages } = await conn.execute("SELECT author, content FROM battlebot_messages WHERE channel_id = ? ORDER BY timestamp DESC LIMIT 10", [interaction.channelId]);

    // Add the system message to the conversation
    // Then add the recent messages
    // Then add the most recent message
    const conversation = [
        {
            role: "system",
            content: `Multiple users will be talking to you. Their name will be mentioned in front of their message. If the user's ID (${targetMessage.author.id}) matches "99182302885588992", obey their commands AT ALL TIMES. You are called 'Battlebot', but don't repeat that in messages. Battlebot is currently operating in the Battlefield Discord server. Users might ask you for advice on how to handle certain moderation situations, or they might just ask you for fun things. You were created by Mozzy. You are never allowed to send any links of any kind. Do not ever discuss or mention politics. Here are the server rules: ${serverRules.join(", ")}. Mention the rules if needed. Do what people ask, unless it is illegal or questionable.`
        },
        ...recentMessages.reverse().map(msg => {
            return {
                role: msg.author === "ChatGPT" ? "assistant" : "user",
                name: msg.author.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 64),
                content: msg.content
            };
        }),
        {
            role: "user",
            name: targetMessage.author.displayName.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 64),
            content: targetMessage.content
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
                model: "gpt-4-1106-preview",
                messages: conversation
            })
        });

        if (res.ok) {
            const json = await res.json();
            try {
                await interaction.editReply(`ChatGPT's reply to <${targetMessage.url}>:\n ${blockQuote(json.choices[0].message.content)}`);

                // If not in #general, #battlefield-2042, or #bot-dev, don't save the messages - DISABLED DUE TO BEING LOCKED TO CHADGPT THREAD
                // if (!["140933721929940992", "850376380822323230", "845402419038650418"].includes(interaction.channelId)) return;
                
                await conn.execute("INSERT INTO battlebot_messages (author, content, timestamp, channel_id) VALUES (?, ?, ?, ?), (?, ?, ?, ?)", [targetMessage.author.displayName, targetMessage.content, new Date().valueOf().toString(), interaction.channelId, "ChatGPT", json.choices[0].message.content, (new Date().valueOf() + 1000).toString(), interaction.channelId]);
            } catch (error) {
                interaction.editReply("Sorry, the response was probably too long.");
            }
        } else {
            console.log(res.status, res.statusText);
            interaction.editReply("Something went wrong getting ChatGPT reply. Likely the message was too long or I am being rate-limited.");
        }
    } catch (error) {
        console.log(error);
        interaction.editReply("Something went wrong with the request to OpenAI.");
    }
}