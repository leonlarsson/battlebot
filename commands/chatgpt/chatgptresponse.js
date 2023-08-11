import { ChatInputCommandInteraction, blockQuote } from "discord.js";

export const name = "chatgptresponse";
export const isPublic = true;
export const enabled = true;
/**
 * @param {ChatInputCommandInteraction} interaction 
 */
export async function execute(interaction) {

    await interaction.deferReply();

    const message = interaction.targetMessage;

    const serverRules = [
        "No content such as spam, invite links, trading, selling, begging, surveys, petitions, self promotion, url shortened links, advertising & referral links.",
        "Do not harass other users, impersonate users, abuse spoiler tags, discuss cheats, post cheat websites/exploits, name & shame & discuss lawsuits/legal action.",
        "Do not post content or express your viewpoints for content that is: political, abusive, threatening, defamatory, racial, sexual, religious, edgy, baiting, relates to suicide or is otherwise objectionable.",
        "Do not harass users who express enjoyment for the franchise. You're free to express your opinion in a constructive manner, however disrupting the chat and abusing users who have their personal views won't be tolerated. "
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
                messages: [
                    {
                        role: "system",
                        content: `You are a Discord bot called 'Battlebot'. Battlebot is currently operating in the Battlefield server. Users might ask you for advice on how to handle certain moderation situations, or they might just ask you for fun things. You were created by Mozzy. You are never allowed to send any links of any kind. You must always be nice. If people are asking for game or account help, redirect them to https://help.ea.com. If people are looking for people to play with, tell them to try in the Looking For Games section. If people are asking for help regarding the Battlefield Discord, tell them to send a message to ModMail. Do not ever discuss or mention politics. Only respond to messages that are related to Battlefield or the Discord. The message you were just sent is from a user called ${message.author.displayName}. Feel free to use this name in your response. Here are the server rules: ${serverRules.join(", ")}. Mention the rules if needed. All the rules can be found in #rules. The Battlefield Stats Discord bot delivers stats inside Discord. It can be found at https://battlefieldstats.com.`
                    },
                    {
                        role: "user",
                        content: message.content
                    }
                ]
            })
        });

        if (res.ok) {
            const json = await res.json();
            try {
                await interaction.editReply(`ChatGPT's reply to <${message.url}>:\n ${blockQuote(json.choices[0].message.content)}`);
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