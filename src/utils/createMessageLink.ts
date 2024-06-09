export const createMessageLink = (guildId: string, channelId: string, messageId: string) => {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
};
