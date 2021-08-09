const Canvas = require("canvas");
const { registerFont } = require('canvas')
const { intervalChannel } = require('../config.json')
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "countdowncanvas",
    public: false,
    disabled: true,
    async execute(message, args, client, Discord, Time) {

        const backgroundNum = Math.floor(Math.random() * 3);
        const userId = message.author?.id || message.user.id; // Get user ID from message or interaction

        try {

            const canvas = Canvas.createCanvas(1000, 400);
            const context = canvas.getContext("2d");
            // const backgroundImage = await Canvas.loadImage(Time.CountdownImage());
            const backgroundImage = await Canvas.loadImage(`./assets/images/BG_BF_${backgroundNum}.png`);

            registerFont('./assets/fonts/Geometos.ttf', { family: "Geometos" });

            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            context.font = '35px Geometos';
            context.fillStyle = '#00ffde';
            context.textAlign = "center";
            context.fillText(Time.EventName, 500, 208);

            context.font = '50px Geometos';
            context.fillStyle = '#00ffde';
            context.textAlign = "center";
            context.fillText(Time.CountdownString(), 500, 302);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${Time.EventName}.png`);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel(Time.ButtonOneText)
                        .setStyle('LINK')
                        .setURL(Time.ButtonOneLink),
                    new MessageButton()
                        .setLabel(Time.ButtonTwoText)
                        .setStyle('LINK')
                        .setURL(Time.ButtonTwoLink),
                )

            // Try sending to message channel, if no channel defined, the request is from the interval. Then send it to the designated interval channel.
            try {
                await message.reply({ content: Time.MessageText, files: [attachment], components: [row] });
            } catch (err) {
                client.channels.cache.get(intervalChannel).send({ content: Time.MessageText, files: [attachment], components: [row] });
            }

        } catch (error) {
            console.log(error);
        }
    }
};