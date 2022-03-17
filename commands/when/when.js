import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js"
dayjs.extend(duration);
import { checkCooldown, addCooldown } from "../../utils/handleCooldowns.js";
import createCountdownCanvas from "../../utils/createCountdownCanvas.js";

export const name = "when";
export const allowed_channels = ["850376380822323230", "177094649473794049", "470275028030849024"];
export const wrong_channel_message = "This is only available in <#850376380822323230> and <#177094649473794049>";
export const cooldown = 5000;
export const isPublic = true;
export const enabled = true;
export async function execute(interaction) {

    // Get user ID from message or interaction
    const userId = interaction.user.id;

    // if (userId !== "99182302885588992") return interaction.reply({ content: "Come back later.", ephemeral: true }); // Temp locked to me
    // Check if there is a DB cooldown query. If there is no query, run code and add cooldown at the bottom. If there is an active one, return and reply. If there is an expired one, update the query
    const query = await checkCooldown(interaction, this);
    if (query && query.cooldownEndsAtTimestamp > new Date().getTime()) return;

    // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
    if (!this.allowed_channels.includes(interaction.channel.id) && userId !== "99182302885588992") {
        return interaction.reply({ content: "Please try this in <#850376380822323230> or <#177094649473794049> instead!", ephemeral: true });
    }

    try {

        let countdownTime, countdownName, canvasBackground, countdownPassed_canvasMessage, countdownPassed_canvasBackground, countdownMessage;
        let buttons = [];

        // Get selected event
        const event = interaction.options.getString("event");

        if (event === "event_name") {

            const backgroundNum = Math.floor(Math.random() * 3);
            canvasBackground = `./assets/images/BG_2042_${backgroundNum}.png`;

            countdownTime = dayjs("2022-04-20 08:00:00");
            countdownName = "Battlefield 2042 Release";
            countdownPassed_canvasMessage = "Get ready to fight!";
            countdownPassed_canvasBackground = "./assets/images/Background_Released.png";
            countdownMessage = `**Battlefield 2042 | Release**\nReleases <t:${countdownTime.unix()}:R> (<t:${countdownTime.unix()}:F>) *Exact time is an estimate*`;
            buttons.push(
                { Text: "Game Page", Link: "https://www.ea.com/games/battlefield/battlefield-2042" },
                { Text: "Buy", Link: "https://www.ea.com/games/battlefield/battlefield-2042/buy" }
            );

        } else if (event === "event_name2") {

            const backgroundNum = Math.floor(Math.random() * 3);
            canvasBackground = `./assets/images/BG_2042_${backgroundNum}.png`;

            countdownTime = dayjs("2022-04-20 10:00:00");
            countdownName = "Battlefield 2042 Release (Gold/Ultimate)";
            countdownPassed_canvasMessage = "Get ready to fight!";
            countdownPassed_canvasBackground = "./assets/images/Background_Released.png";
            countdownMessage = `**Battlefield 2042 | Release (Gold/Ultimate)**\nReleased <t:${countdownTime.unix()}:R> (<t:${countdownTime.unix()}:F>)`;
            buttons.push(
                { Text: "Game Page", Link: "https://www.ea.com/games/battlefield/battlefield-2042" },
                { Text: "Buy", Link: "https://www.ea.com/games/battlefield/battlefield-2042/buy" }
            );

        }

        const currentTime = dayjs();
        const duration = dayjs.duration(countdownTime.diff(currentTime));

        const Event = {
            EventName: countdownName,
            MessageText: countdownMessage,
            Buttons: buttons,
            Years: duration.years(),
            Months: duration.months(),
            Days: duration.days(),
            Hours: duration.hours(),
            Minutes: duration.minutes(),
            Seconds: duration.seconds(),
            YearsText: () => Event.Years === 1 ? "year" : "years",
            MonthsText: () => Event.Months === 1 ? "month" : "months",
            DaysText: () => Event.Days === 1 ? "day" : "days",
            HoursText: () => Event.Hours === 1 ? "hour" : "hours",
            MinutesText: () => Event.Minutes === 1 ? "minute" : "minutes",
            SecondsText: () => Event.Seconds === 1 ? "second" : "seconds",
            HasPassed: () => countdownTime.isBefore(currentTime),
            CountdownBackground: () => Event.HasPassed() ? countdownPassed_canvasBackground : canvasBackground,
            CountdownString: () => {

                if (Event.HasPassed()) return countdownPassed_canvasMessage;

                // Less than a minute left
                if (duration.asMinutes() < 1) {
                    return `${Event.Seconds} ${Event.SecondsText()}`;
                }

                // Less than an hour left
                if (duration.asHours() < 1) {
                    return `${Event.Minutes} ${Event.MinutesText()}, ${Event.Seconds} ${Event.SecondsText()}`;
                }

                // Less than 6 hours left
                if (duration.asHours() < 6) {
                    return `${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}, ${Event.Seconds} ${Event.SecondsText()}`;
                }

                // Less than a day left
                if (duration.asDays() < 1) {
                    return `${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}`;
                }

                // More than a day and less than a month
                if (duration.asDays() >= 1 && duration.asMonths() < 1) {
                    return `${Event.Days} ${Event.DaysText()}, ${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}`;
                }

                // More than a month left
                return `${Event.Months} ${Event.MonthsText()}, ${Event.Days} ${Event.DaysText()}, ${Event.Hours} ${Event.HoursText()}`;
            }
        };

        // If there is no cooldown query, create a new one
        if (!query) addCooldown(interaction, this);

        createCountdownCanvas(interaction, Event);

    } catch (err) {
        console.error(err);
    }
}
