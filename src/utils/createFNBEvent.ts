import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import utc from "dayjs/plugin/utc.js";
import {
  type ChatInputCommandInteraction,
  type Client,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  type TextChannel,
} from "discord.js";
dayjs.extend(utc);
dayjs.extend(advancedFormat);
import { CronJob } from "cron";

/**
 * Starts a cron job to create to FNB event.
 * @param {Client} client The client.
 */
export const startFNBEventCronJob = (client: Client) => {
  try {
    // Create FNB event every Monday at 12:00 midday
    new CronJob("00 12 * * MON", () => createFNBEvent(client), null, true, "Europe/Stockholm");
  } catch (error) {
    console.log("Error in startFNBEventCron():", error);
  }
};

export const createFNBEvent = (client: Client, interaction?: ChatInputCommandInteraction) => {
  try {
    // If live, use BFD as guild and #fnb-bfd-staff as channel. Otherwise Mozzy server and #bot-dev
    const guildId = process.env.ENVIRONMENT === "live" ? "140933721929940992" : "99183009621622784";
    const confirmationChannelId = process.env.ENVIRONMENT === "live" ? "907954411970658335" : "845402419038650418";
    const fnbNewsChannelId = "907954362637234246"; // #fnb-news on BFD

    const guild = client.guilds.cache.get(guildId);
    const fnbStart = dayjs.utc().day(5).hour(19).minute(30);
    const fnbEnd = dayjs.utc().day(6).hour(3).minute(0);

    // Return if guild is not there
    if (!guild) return console.log(`Failed to find guild ${guildId}`);

    // Build and create event
    guild.scheduledEvents
      .create({
        name: `#FridayNightBattlefield - ${fnbStart.format("MMMM D")}`,
        description: `Welcome to **#FridayNightBattlefield**, a weekly event where players get together to play Battlefield in a friendly atmosphere with DICE developers and Electronic Arts staff. It is a long-standing event with deep roots in the Battlefield community.\n\nThe event is hosted in multiple languages, has many dedicated servers for everyone to join in on.\nFor more information, look in <#${fnbNewsChannelId}>.`,
        image: "./assets/images/FNB.png",
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: { location: "The FridayNightBattlefield Category" },
        scheduledStartTime: fnbStart.toISOString(),
        scheduledEndTime: fnbEnd.toISOString(),
        reason: `Automatically creating event for FNB (${fnbStart.format("MMMM D")})`,
      })
      .then((event) => {
        console.log(`Created FNB event: ${event.name}`);
        const successMessage = `✅ Created FNB event: \`${event.name}\`\n${process.env.ENVIRONMENT === "live" ? `https://discord.gg/battlefield?event=${event.id}` : event.url}`;

        // If command was run from an interaction, reply to that interaction, and try to send in #fnb-news on BFD
        if (interaction) {
          interaction.editReply({ content: successMessage, components: [] });
          (client.channels.cache.get(fnbNewsChannelId) as TextChannel)?.send(successMessage);
        } else {
          // Attempt to send to both channels
          [confirmationChannelId, fnbNewsChannelId].forEach((channel) =>
            (client.channels.cache.get(channel) as TextChannel)?.send(successMessage),
          );
        }
      })
      .catch((error) => {
        console.log("Failed to create FNB event.", error);
        const failMessage = `❌ Failed to create FNB event :(\n\`${error.message}\``;

        // If command was run from an interaction, reply to that interaction
        if (interaction) {
          interaction.editReply({ content: failMessage, components: [] });
        } else {
          (client.channels.cache.get(confirmationChannelId) as TextChannel)?.send(failMessage);
        }
      });
  } catch (error) {
    console.log("Error in createFNBEvent():", error);
  }
};
