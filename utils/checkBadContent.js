const moment = require("moment");
const badWordsRegex = require("../utils/badWordsRegex");

module.exports = async (message, client) => {

    const includedChannels = ["850376380822323230", "177094649473794049", "140933721929940992", "422598689928773632", "792878528609386536", "446371403445436426", "895042103564972062", "258372071086620674", "174646583021928460", "179133571053780992", "179133477533253632", "179133087102402560", "739938247089848351", "848713856309657621", "663419213918240800"];
    // battlefield-2042, battlefield, general, technology, other-games, stats, giveaway-winner-chat, art-cinematics, streams-and-videos, pc, xbox, playstation, recruitment, voice-commands, testing (mozzy server)

    const excludedRoles = ["140941611415633920", "745168923577679872", "174949751152836608", "450991619492282388", "470283967216615442"]; // Admin, Leads, Mods, Trainees, EA Community
    const alertChannel = "663419213918240800"; // #testing | mozzy server

    if (!includedChannels.includes(message.channel.id)) return;
    if (excludedRoles.some(r => message.member.roles.cache.has(r))) return;

    const matchedContent = message.content.match(badWordsRegex);

    if (matchedContent) {
        await message.delete().catch(() => { });
        setTimeout(() => {
            client.channels.cache.get(alertChannel).send({ content: `\`[${moment.utc().format("YYYY-MM-DD HH:mm:ss UTC")}]\` ⛔ Detected bad content in <#${message.channel.id}> from <@${message.author.id}> (${message.author.id})\nMatched ${matchedContent.length > 1 ? `${matchedContent.length} words` : `1 word`}: \`${matchedContent.slice(0, 3).join("`, `")}\`${matchedContent.length > 3 ? ` (+${matchedContent.length - matchedContent.slice(0, 3).length})` : ""} in the message below:\n\`\`\`\n${message.content}\n\`\`\`\n${message.deleted ? "Actions taken: **delete, log**" : `Link: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}\nAction taken: **log**`}`, allowedMentions: { parse: [] } }).then(msg => msg.suppressEmbeds(true));
            return;
        }, 200);
    }
}