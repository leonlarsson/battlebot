const moment = require("moment");

module.exports = {
    name: "when",
    // permissions: ["EMBED_LINKS"],
    allowed_channels: ["850376380822323230", "177094649473794049", "470275028030849024"], // #battlefield-2042, #battlefield, #server-planning
    cooldown: 5000,
    public: true,
    enabled: true,
    async execute(interaction, _args, client) {

        const userId = interaction.user.id; // Get user ID from message or interaction
        // if (userId !== "99182302885588992") return interaction.reply({ content: "Come back later.", ephemeral: true }); // Temp locked to me

        if (!this.allowed_channels.includes(interaction.channel.id) && userId !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
            return interaction.reply({ content: "Please try this in <#850376380822323230> or <#177094649473794049> instead!", ephemeral: true });
        }

        try {

            let countdownTime, countdownName, countdownPassed_canvasMessage, countdownMessage, buttonOneText, buttonOneLink, buttonTwoText, buttonTwoLink;

            const event = interaction.options.getString("event") || "release"; // Get selected event and set default event

            if (event === "release") {

                countdownTime = moment.utc("2021-11-19 08:00:00");
                countdownName = "Battlefield 2042 Release";
                countdownPassed_canvasMessage = "Go check #game-news!";
                countdownMessage = `**Battlefield 2042 | Release**\nReleases <t:${countdownTime.unix()}:R> (<t:${countdownTime.unix()}:F>) *Exact time is an estimate*`;
                buttonOneText = "Game Page";
                buttonOneLink = "https://www.ea.com/games/battlefield/battlefield-2042";
                buttonTwoText = "Pre-Order";
                buttonTwoLink = "https://www.ea.com/games/battlefield/battlefield-2042/buy";

            } else if (event === "early_release") {

                countdownTime = moment.utc("2021-11-12 08:00:00");
                countdownName = "Battlefield 2042 Release (Gold/Ultimate)";
                countdownPassed_canvasMessage = "Go check #game-news!";
                countdownMessage = `**Battlefield 2042 | Release (Gold/Ultimate)**\nReleases <t:${countdownTime.unix()}:R> (<t:${countdownTime.unix()}:F>) *Exact time is an estimate*`;
                buttonOneText = "Game Page";
                buttonOneLink = "https://www.ea.com/games/battlefield/battlefield-2042";
                buttonTwoText = "Pre-Order";
                buttonTwoLink = "https://www.ea.com/games/battlefield/battlefield-2042/buy";

            }

            const currentTime = moment.utc();
            const duration = moment.duration(countdownTime.diff(currentTime));

            const Event = {
                EventName: countdownName,
                MessageText: countdownMessage,
                ButtonOneText: buttonOneText,
                ButtonOneLink: buttonOneLink,
                ButtonTwoText: buttonTwoText,
                ButtonTwoLink: buttonTwoLink,
                Years: duration.years(),
                Months: duration.months(),
                Days: duration.days(),
                Hours: duration.hours(),
                Minutes: duration.minutes(),
                Seconds: duration.seconds(),
                MonthText: () => {
                    if (Event.Months === 1) {
                        return "month";
                    } else {
                        return "months";
                    }
                },
                DaysText: () => {
                    if (Event.Days === 1) {
                        return "day";
                    } else {
                        return "days";
                    }
                },
                HoursText: () => {
                    if (Event.Hours === 1) {
                        return "hour";
                    } else {
                        return "hours";
                    }
                },
                MinutesText: () => {
                    if (Event.Minutes === 1) {
                        return "minute";
                    } else {
                        return "minutes";
                    }
                },
                SecondsText: () => {
                    if (Event.Seconds === 1) {
                        return "second";
                    } else {
                        return "seconds";
                    }
                },
                HasPassed: () => {
                    return countdownTime.isBefore(currentTime);
                },
                CountdownString: () => {

                    if (Event.HasPassed()) {
                        return countdownPassed_canvasMessage;
                    }

                    if (duration._milliseconds < 60000) { // Less than a minute left
                        return `${Event.Seconds} ${Event.SecondsText()}`;
                    }

                    if (duration._milliseconds < 3600000) { // Less than an hour left
                        return `${Event.Minutes} ${Event.MinutesText()}, ${Event.Seconds} ${Event.SecondsText()}`;
                    }

                    if (duration._milliseconds < 21600000) { // Less than 6 hours left
                        return `${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}, ${Event.Seconds} ${Event.SecondsText()}`;
                    }

                    if (duration._milliseconds < 86400000) { // Less than a day left
                        return `${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}`;
                    }

                    if (duration._milliseconds >= 86400000 && duration._milliseconds < 2592000000) { // More than a day and less than a month
                        return `${Event.Days} ${Event.DaysText()}, ${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}`;
                    }

                    // More than a month left
                    return `${Event.Months} ${Event.MonthText()}, ${Event.Days} ${Event.DaysText()}, ${Event.Hours} ${Event.HoursText()}`
                },
                // CountdownImage: () =>  {

                //     if (duration._milliseconds < 3600000) { // Less than an hour left
                //         return `./assets/images/Background_1Hour.png`;
                //     }

                //     if (duration._milliseconds < 21600000) { // Less than 6 hours left
                //         return `./assets/images/Background_6Hours.png`;
                //     }

                //     if (duration._milliseconds < 43200000) { // Less than 12 hours left
                //         return `./assets/images/Background_12Hours.png`;
                //     }

                //     if (duration._milliseconds < 86400000) { // Less than a day left
                //         return `./assets/images/Background_1Day.png`;
                //     }

                //     // If more or equal to a day left
                //     return `./assets/images/Background_Over1Day.png`;
                // }
            }

            client.commands.get("countdowncanvas").execute(interaction, Event);

        } catch (err) {
            console.error(err);
        }
    }
};
