const Canvas = require("canvas");
const { registerFont } = require('canvas')
const { intervalChannel } = require('../config.json')
const { MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "countdowncanvas",
    public: false,
    enabled: false,
    async execute(interaction, client, Event) {

        const backgroundNum = Math.floor(Math.random() * 3);

        try {

            const canvas = Canvas.createCanvas(1000, 400);
            const context = canvas.getContext("2d");
            // const backgroundImage = await Canvas.loadImage(Event.CountdownImage());
            const backgroundImage = await Canvas.loadImage(`./assets/images/BG_BF_${backgroundNum}.png`);

            registerFont('./assets/fonts/Geometos.ttf', { family: "Geometos" });

            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            context.font = '35px Geometos';
            context.fillStyle = '#00ffde';
            context.textAlign = "center";
            context.fillText(Event.EventName, 500, 208);

            context.font = '50px Geometos';
            context.fillStyle = '#00ffde';
            context.textAlign = "center";
            context.fillText(Event.CountdownString(), 500, 302);

            const attachment = new MessageAttachment(canvas.toBuffer(), `${Event.EventName}.png`);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel(Event.ButtonOneText)
                        .setStyle('LINK')
                        .setURL(Event.ButtonOneLink),
                    new MessageButton()
                        .setLabel(Event.ButtonTwoText)
                        .setStyle('LINK')
                        .setURL(Event.ButtonTwoLink),
                )

            // Try sending to message channel, if no channel defined, the request is from the interval. Then send it to the designated interval channel.
            try {
                await interaction.reply({ content: Event.MessageText, files: [attachment], components: [row] });
            } catch (err) {
                client.channels.cache.get(intervalChannel).send({ content: Event.MessageText, files: [attachment], components: [row] });
            }

        } catch (error) {
            console.log(error);
        }
    }
};