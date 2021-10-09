const checkBadContent = require('../utils/checkBadContent');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {

        const disabled = true;
        if (disabled) return;
        if (message.author.bot) return;

        checkBadContent(message, client);

    },
};