const Canvas = require("canvas");
const { registerFont } = require('canvas')
const { intervalChannel } = require('../config.json')

module.exports = {
    name: "countdowncanvas",
    public: false,
    disabled: true,
    async execute(message, args, client, Discord, Time) {

        const backgroundNum = Math.floor(Math.random() * 3);

        try {

            if (args[0] && message.author.id == "99182302885588992") { // If there are args and the arg isn't "reveal", and if the command sender is me, use special values. If no args, use normal countdown and event.
                Time.EventName = `When ${args.join(" ")}`;
                Time.CountdownString = function() {
                    return "I dunno";
                }
            }

            const canvas = Canvas.createCanvas(1000, 400);
            const context = canvas.getContext("2d");
            // const backgroundImage = await Canvas.loadImage(Time.CountdownImage());
            const backgroundImage = await Canvas.loadImage(`./assets/images/BG_BF_${backgroundNum}.png`);
            

            registerFont('./assets/fonts/Geometos.ttf', { family: "Geometos" });

            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            // context.globalAlpha = 0.6;
            // context.fillStyle = "#000";
            // context.fillRect(412, 175, 175, 40);  // left, top, width, height
            // context.globalAlpha = 1.0;

            context.font = '35px Geometos';
            context.fillStyle = '#00ffde';
            context.textAlign = "center";
            context.fillText(Time.EventName, 500, 208);

            context.font = '50px Geometos';
            context.fillStyle = '#00ffde';
            context.textAlign = "center";
            context.fillText(Time.CountdownString(), 500, 302);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `BF_Reveal.png`);

            // Try sending to message channel, if no channel defined, the request is from the interval. Then send it to the designated interval channel.
            try {
                await message.channel.send(Time.MessageText, attachment)
            } catch (err) {
                client.channels.cache.get(intervalChannel).send(Time.MessageText, attachment)
            }

        } catch (error) {
            console.log(error);
        }
    }
};