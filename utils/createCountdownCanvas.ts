import {
  AttachmentBuilder,
  ComponentType,
  ButtonStyle,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";
import Canvas from "@napi-rs/canvas";

export default async (interaction: ChatInputCommandInteraction, Event: any) => {
  // const backgroundNum = Math.floor(Math.random() * 3);

  try {
    const canvas = Canvas.createCanvas(1000, 400);
    const context = canvas.getContext("2d");
    const backgroundImage = await Canvas.loadImage(Event.CountdownBackground());

    Canvas.GlobalFonts.registerFromPath("./assets/fonts/Geometos.ttf", "Geometos");

    // Background image. (With the game logo)
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Event name background
    context.font = "35px Geometos";
    const eventName = context.measureText(Event.EventName);
    context.fillStyle = "rgba(0, 0, 0, .4)";
    context.fillRect(canvas.width / 2 - eventName.width / 2 - 10, 175, eventName.width + 20, 40);

    //Event name text
    context.fillStyle = "#00ffde";
    context.textAlign = "center";
    context.fillText(Event.EventName, 500, 208, 950);

    // Countdown background
    context.fillStyle = "rgba(0, 0, 0, .6)";
    context.fillRect(0, 250, canvas.width, 70);

    // Countdown text
    context.font = "50px Geometos";
    context.fillStyle = "#00ffde";
    context.textAlign = "center";
    context.fillText(Event.CountdownString(), 500, 302, 950);

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: `${Event.EventName}.png` });

    const row = { type: ComponentType.ActionRow, components: [] };

    // If there are buttons specified, add to row
    if (Event.Buttons.length) {
      Event.Buttons.forEach((button: { label: string; url: string }) => {
        // @ts-ignore
        row.components.push({
          type: ComponentType.Button,
          style: ButtonStyle.Link,
          label: button.label,
          url: button.url,
        });
      });
    }

    // If the user does NOT have EMBED_LINKS, send an ephemeral reply instead.
    const ephemeral = !(interaction.channel as TextChannel)
      .permissionsFor(interaction.user)!
      .has(PermissionFlagsBits.EmbedLinks);

    interaction.reply({
      content: Event.MessageText,
      files: [attachment],
      components: Event.Buttons.length ? [row] : [],
      ephemeral,
    });
  } catch (error) {
    console.log(error);
  }
};
