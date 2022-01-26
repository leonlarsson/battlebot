const moment = require("moment");
// eslint-disable-next-line no-unused-vars
const { badWordsRegex, scamLinkRegex } = require("../utils/badWordsRegex");

module.exports = async (message, client) => {

    const includedChannels = ["850376380822323230", "907670041028329532", "907670155125989456", "907670279675842640", "908101543646089236", "177094649473794049", "446371403445436426", "140933721929940992", "422598689928773632", "792878528609386536", "258372071086620674", "179133087102402560", "174646583021928460", "179133571053780992", "179133477533253632", "179133087102402560", "739938247089848351"];
    // battlefield-2042, hazard-zone, portal, portal-builder, portal-sharing, battlefield, stats, general, technology, other-games, art-cinematics, streams-and-videos, pc, xbox, playstation, recruitment

    const excludedRoles = ["140941611415633920", "745168923577679872", "174949751152836608", "450991619492282388", "470283967216615442"]; // Admin, Leads, Mods, Trainees, EA Community
    const alertChannel = "663419213918240800"; // #testing | mozzy server

    if (!includedChannels.includes(message.channel.id)) return;
    if (excludedRoles.some(r => message.member.roles.cache.has(r))) return;

    // const matchedContent = message.content.match(badWordsRegex);
    const matchedContent = message.content.match(scamLinkRegex);

    if (matchedContent) {
        await message.delete().catch(() => { });
        setTimeout(() => {
            client.channels.cache.get(alertChannel).send({ content: `\`[${moment.utc().format("YYYY-MM-DD HH:mm:ss UTC")}]\` ⛔ Detected bad content in <#${message.channel.id}> from <@${message.author.id}> (${message.author.id})\nMatched ${matchedContent.length > 1 ? `${matchedContent.length} words` : `1 word`}: \`${matchedContent.slice(0, 3).join("`, `")}\`${matchedContent.length > 3 ? ` (+${matchedContent.length - matchedContent.slice(0, 3).length})` : ""} in the message below:\n\`\`\`\n${message.content}\n\`\`\`\n${message.deleted ? "Actions taken: **delete, log**" : `Link: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}\nAction taken: **log**`}`, allowedMentions: { parse: [] } }).then(msg => msg.suppressEmbeds(true));
            return;
        }, 200);
    }
}