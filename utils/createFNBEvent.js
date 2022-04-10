// eslint-disable-next-line no-unused-vars
import { Client, CommandInteraction } from "discord.js";
import { GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } from "discord-api-types/v9";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
import { CronJob } from "cron";
import { environment } from "../config.js";

/** 
 * Starts a cron job to create to FNB event.
 * @param {Client} client The client.
*/
export const startFNBEventCronJob = client => {

    try {

        // Create FNB event every Monday at 12:00 midday
        const createFNBEventJob = new CronJob("00 12 * * MON", () => createFNBEvent(client));

        // Run job
        createFNBEventJob.start();

    } catch (error) {
        console.log("Error in startFNBEventCron():", error);
    }
}

/**
 * Creates the FNB event.
 * @param {Client} client The client.
 * @param {CommandInteraction=} interaction The interaction, if entry was a command.
 */
export const createFNBEvent = (client, interaction) => {

    try {

        // If live, use BFD as guild and #fnb-bfd-staff as channel. Otherwise Mozzy server and #bot-dev
        const guildId = environment === "live" ? "140933721929940992" : "99183009621622784";
        const confirmationChannelId = environment === "live" ? "907954411970658335" : "845402419038650418";
        const fnbNewsChannelId = "907954362637234246"; // #fnb-news on BFD

        const guild = client.guilds.cache.get(guildId);
        const fnbStart = dayjs().tz("Europe/Stockholm").day(5).hour(21).minute(30);
        const fnbNAStart = dayjs().tz("America/New_York").day(5).hour(21).minute(0);
        const fnbEnd = dayjs().tz("Europe/Stockholm").day(6).hour(5).minute(0);

        // Return if guild is not there
        if (!guild) return console.log(`Failed to find guild ${guildId}`);

        // Build and create event
        guild.scheduledEvents.create({
            name: `#FridayNightBattlefield - ${fnbStart.format("MMMM D")}`,
            description: `Welcome to **#FridayNightBattlefield**, a weekly event where players get together to play Battlefield in a friendly atmosphere with DICE developers and Electronic Arts staff. It is a long-standing event with deep roots in the Battlefield community.\n\nThe event is hosted in multiple languages, has many dedicated servers for everyone to join in on.\nFor more information, look in <#${fnbNewsChannelId}>.\n\n__**Start times**__\n🇪🇺 EU: <t:${fnbStart.unix()}:R> (${fnbStart.tz("UTC").format("MMM D, hh:mm A z")})\n🇺🇸 NA: <t:${fnbNAStart.unix()}:R> (${fnbNAStart.format("MMM D, hh:mm A z")})`,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.External,
            entityMetadata: { location: "The FridayNightBattlefield Category" },
            scheduledStartTime: fnbStart,
            scheduledEndTime: fnbEnd,
            reason: `Automatically creating event for FNB (${fnbStart.format("MMMM D")})`
        }).then(event => {
            console.log(`Created FNB event: ${event.name}`);
            const successMessage = `✅ Created FNB event: \`${event.name}\`\n${environment === "live" ? `https://discord.gg/battlefield?event=${event.id}` : event.url}`;

            // If command was run from an interaction, reply to that interaction, and try to send in #fnb-news on BFD
            if (interaction) {
                interaction.editReply({ content: successMessage, components: [] });
                client.channels.cache.get(fnbNewsChannelId)?.send(successMessage);
            } else {
                // Attempt to send to both channels
                [confirmationChannelId, fnbNewsChannelId].forEach(channel => client.channels.cache.get(channel)?.send(successMessage));
            }
        }).catch(error => {
            console.log("Failed to create FNB event.", error);
            const failMessage = `❌ Failed to create FNB event :(\n\`${error.message}\``;

            // If command was run from an interaction, reply to that interaction
            if (interaction) {
                interaction.editReply({ content: failMessage, components: [] });
            } else {
                client.channels.cache.get(confirmationChannelId).send(failMessage);
            }
        });
    } catch (error) {
        console.log("Error in createFNBEvent():", error);
    }
}