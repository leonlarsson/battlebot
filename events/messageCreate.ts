import { ChannelType, Events, Message, Client } from "discord.js";
import type { Event } from "../types";

export default {
  name: Events.MessageCreate,
  execute: (_client: Client, message: Message) => {
    const isAnnouncementChannel =
      message.channel.type === ChannelType.GuildAnnouncement;
    const inDirectCommChannel = message.channelId === "908502197170503740";
    const isCorrectWebhook = message.webhookId === "1113160068171575297";

    if (isAnnouncementChannel && inDirectCommChannel && isCorrectWebhook) {
      console.log(`Auto-publishing new post in ${message.channel.name}`);
      message.crosspost();
    }
  },
} satisfies Event;
