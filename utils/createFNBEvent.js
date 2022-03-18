import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
import { CronJob } from "cron";
import { environment } from "../config.js";

/** 
 * Starts a cron job to create an FNB event.
 * @param {Client} client The client.
*/
export default client => {

    try {

        // Create FNB event Wednesday at 12:00 midday
        const createFNBEventJob = new CronJob("00 12 * * WED", () => {

            // If live, use BFD as guild and #fnb-bfd-staff as channel
            const guildId = environment === "live" ? "140933721929940992" : "99183009621622784";
            const channelId = environment === "live" ? "907954411970658335" : "845402419038650418";

            const guild = client.guilds.cache.get(guildId);
            const fnbStart = dayjs().day(5).hour(21).minute(30);
            const fnbNAStart = dayjs().day(6).hour(2).minute(0);
            const fnbEnd = dayjs().day(6).hour(5).minute(0);

            // Return if guild is not there
            if (!guild) return console.log(`Failed to find guild ${guildId}`);

            // Build and create event
            guild.scheduledEvents.create({
                name: `#FridayNightBattlefield - ${fnbStart.format("MMMM D")}`,
                description: `Welcome to **#FridayNightBattlefield**, a weekly event where players get together to play Battlefield in a friendly atmosphere with DICE developers and Electronic Arts staff. It is a long-standing event with deep roots in the Battlefield community.\n\nThe event is hosted in multiple languages, has many dedicated servers for everyone to join in on.\nFor more information look in <#907954362637234246>.\n\n__**Start times**__\n🇪🇺 EU: <t:${fnbStart.unix()}:R> (${fnbStart.utc().format("MMM D, hh:mm A")} UTC)\n🇺🇸 NA: <t:${fnbNAStart.unix()}:R> (${fnbNAStart.tz("America/New_York").format("MMM D, hh:mm A z")})`,
                privacyLevel: "GUILD_ONLY",
                entityType: "EXTERNAL",
                entityMetadata: { location: "The FridayNightBattlefield Category" },
                scheduledStartTime: fnbStart,
                scheduledEndTime: fnbEnd
            }).then(event => {
                console.log(`Created FNB event: ${event.name}`);
                client.channels.cache.get(channelId).send(`✅ Created FNB event: \`${event.name}\``);
            }).catch(error => {
                console.log("Failed to create FNB event.", error);
                client.channels.cache.get(channelId).send(`❌ Failed to create FNB event :(\n\`${error.message}\``);
            });

        });

        // Run job
        createFNBEventJob.start();

    } catch (error) {
        console.log("Error in createFNBEvent.js:", error);
    }
}