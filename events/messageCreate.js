import checkBadContent from "../utils/checkBadContent.js";

export const name = 'messageCreate';
export async function execute(message, client) {

    const disabled = true;
    if (disabled) return;
    if (message.author.bot) return;

    checkBadContent(message, client);

}