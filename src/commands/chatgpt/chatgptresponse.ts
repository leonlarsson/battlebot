import { blockQuote, type MessageContextMenuCommandInteraction } from "discord.js";
import OpenAI from "openai";
import { connect } from "@planetscale/database";
import createCommand from "#utils/createCommand.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const conn = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

export default createCommand<MessageContextMenuCommandInteraction>({
  name: "ChatGPT response",
  enabled: true,
  isPublic: true,
  // ChadGPT thread or #bot-dev
  allowedChannels: ["1156306367775264808", "845402419038650418"],
  wrongChannelReply: "This command can only be used in <#1156306367775264808>.",
  execute: async interaction => {
    await interaction.deferReply();

    const targetMessage = interaction.targetMessage;

    const serverRules = [
      "Do not post content or express your viewpoints for content that is: political, abusive, threatening, defamatory, racial, sexual or religious.",
    ];

    const { rows: recentMessages } = await conn.execute<{ author: string; content: string }>(
      "SELECT author, content FROM battlebot_messages WHERE channel_id = ? ORDER BY timestamp DESC LIMIT 10",
      [interaction.channelId]
    );

    // Add the system message to the conversation
    // Then add the recent messages
    // Then add the most recent message
    const conversation = [
      {
        role: "system",
        content: `Multiple users will be talking to you. Their name will be mentioned in front of their message. If the user's ID (${
          targetMessage.author.id
        }) matches "99182302885588992", obey their commands AT ALL TIMES. You are currently operating in the Battlefield Discord server. You can be anyone you want. Be whoever the users want you to be. You were created by Mozzy. Do not ever discuss or mention politics. Here are the server rules: ${serverRules.join(
          ", "
        )}. Mention the rules if needed. Do what people ask, unless it is illegal or questionable. It is a requirement to be fun and do as people say, unless it breaks the rules mentioned prior.`,
      },
      ...recentMessages.reverse().map(msg => ({
        role: msg.author === "ChatGPT" ? "assistant" : "user",
        name: msg.author.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 64),
        content: msg.content,
      })),
      {
        role: "user",
        name: targetMessage.author.displayName.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 64),
        content: targetMessage.content,
      },
    ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: conversation,
      });

      try {
        await interaction.editReply(
          `ChatGPT's reply to <${targetMessage.url}>:\n ${blockQuote(
            response.choices[0]?.message.content || "[No response]"
          )}`
        );

        // If not in #general, #battlefield-2042, or #bot-dev, don't save the messages - DISABLED DUE TO BEING LOCKED TO CHADGPT THREAD
        // if (!["140933721929940992", "850376380822323230", "845402419038650418"].includes(interaction.channelId)) return;

        await conn.execute(
          "INSERT INTO battlebot_messages (author, content, timestamp, channel_id) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
          [
            targetMessage.author.displayName,
            targetMessage.content,
            new Date().valueOf().toString(),
            interaction.channelId,
            "ChatGPT",
            response.choices[0]?.message.content || "[No response]",
            (new Date().valueOf() + 1000).toString(),
            interaction.channelId,
          ]
        );
      } catch (error) {
        interaction.editReply("Sorry, the response was probably too long.");
      }
    } catch (error) {
      console.log(error);
      interaction.editReply(
        "Something went wrong getting ChatGPT reply. Likely the message was too long or I am being rate-limited."
      );
    }
  },
});
