/* eslint-disable no-useless-escape */

/**
 * Cleans a string from links and invite links.
 * @param {string} content Content to clean
 * @returns {string}
 */
export default content => {
    const strings = ["Raccoon Club", "Grandma's Knitting Club", "Trash Panda Fanclub", "Baddies", "Paik Fanclub"];

    // Remove invites and link embeds
    const inviteRegex = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/[^\s/]+?(?=\b)/g;
    const linkRegex = /(http(s)?:\/\/.?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
    const ssRegex = /\bss\b/gi;
    return content.replace(inviteRegex, "[INVITE REMOVED]").replace(linkRegex, `<$1>`).replace(ssRegex, strings[Math.floor(Math.random() * strings.length)]);
}