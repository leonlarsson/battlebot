import { ChannelType, Events } from "discord.js";
import createEvent from "#utils/createEvent.ts";

export default createEvent({
  name: Events.MessageCreate,
  execute: (message) => {
    const isAnnouncementChannel = message.channel.type === ChannelType.GuildAnnouncement;
    const inDirectCommChannel = message.channelId === "908502197170503740";
    const isCorrectWebhook = message.webhookId === "1113160068171575297";

    if (isAnnouncementChannel && inDirectCommChannel && isCorrectWebhook) {
      console.log(`Auto-publishing new post in ${message.channel.name}`);
      message.crosspost();
    }
  },
});
