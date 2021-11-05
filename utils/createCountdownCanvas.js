const Canvas = require("canvas");
const { registerFont } = require('canvas')
const { MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (interaction, Event) => {

    const backgroundNum = Math.floor(Math.random() * 3);

    try {

        const canvas = Canvas.createCanvas(1000, 400);
        const context = canvas.getContext("2d");
        const backgroundImage = await Canvas.loadImage(`./assets/images/BG_2042_${backgroundNum}.png`);
        // const backgroundImage = await Canvas.loadImage(Event.CountdownImage());
        // const backgroundImage = await Canvas.loadImage("./assets/images/BG_BF_ONLY_LOGO.png");

        registerFont('./assets/fonts/Geometos.ttf', { family: "Geometos" });

        // Background image. (With the game logo)
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Event name background
        context.font = '35px Geometos';
        const eventName = context.measureText(Event.EventName);
        context.fillStyle = "rgba(0, 0, 0, .4)";
        context.fillRect((canvas.width / 2 - eventName.width / 2) - 10, 175, eventName.width + 20, 40);

        //Event name text
        context.fillStyle = '#00ffde';
        context.textAlign = "center";
        context.fillText(Event.EventName, 500, 208);

        // Countdown background
        context.fillStyle = "rgba(0, 0, 0, .6)";
        context.fillRect(0, 250, canvas.width, 70);

        // Countdown text
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

        // If the user does NOT have EMBED_LINKS, send an ephemeral reply instead.
        let permCheck;
        interaction.channel.permissionsFor(interaction.user).has("EMBED_LINKS") ? permCheck = false : permCheck = true;
        await interaction.reply({ content: Event.MessageText, files: [attachment], components: [row], ephemeral: permCheck });

    } catch (error) {
        console.log(error);
    }
}