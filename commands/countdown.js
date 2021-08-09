const moment = require("moment");

module.exports = {
    name: "when",
    aliases: ["countdown", "reveal"],
    permissions: ["EMBED_LINKS"],
    allowed_channels: ["850376380822323230", "177094649473794049", "470275028030849024"],
    cooldown: 5,
    public: true,
    async execute(message, args, client, Discord) {
        
        const userId = message.author?.id || message.user.id; // Get user ID from message or interaction
        // if (userId !== "99182302885588992") return message.reply({ content: "Come back later.", ephemeral: true }); // Temp locked to me

        if (!this.allowed_channels.includes(message.channel.id) && userId !== "99182302885588992") { // If channel isn't part of allowed_channels and the user isn't Mozzy, return.
            return message.reply({ content: "Please try this in <#850376380822323230> or <#177094649473794049> instead!", ephemeral: true });
        }

        try {

            let countdownTime, countdownName, countdownTimePassed, messageText, countdownText, buttonOneText, buttonOneLink, buttonTwoText, buttonTwoLink;

            const event = message.options?.get("event")?.value || "exodus";
            const customText = message.options?.get("text")?.value || args.join(" ");

            if (customText && userId === "99182302885588992") {

                countdownTime = moment.utc("9999-12-12 12:00:00");
                countdownName = customText;
                messageText = "<:CursedCat:869694866752405554><:CursedCat:869694866752405554><:CursedCat:869694866752405554><:CursedCat:869694866752405554><:CursedCat:869694866752405554><:CursedCat:869694866752405554><:CursedCat:869694866752405554><:CursedCat:869694866752405554>";
                countdownText = "I dunno"
                buttonOneText = "Google";
                buttonOneLink = "https://google.com";
                buttonTwoText = "Also Google";
                buttonTwoLink = "https://youtu.be/j5a0jTc9S10";

            } else if (event === "exodus") {

                countdownTime = moment.utc("2021-08-12 15:00:00");
                countdownName = "Exodus Short Film";
                countdownTimePassed = "Go check #game-news!";
                messageText = "**Battlefield 2042 | Exodus Short Film**\nPremieres <t:1628780400:R>";
                buttonOneText = "YouTube";
                buttonOneLink = "https://youtu.be/FJVCfhLEYdo";
                buttonTwoText = "Timezones";
                buttonTwoLink = "https://everytimezone.com/s/47e19450";

            } else if (event === "release") {

                countdownTime = moment.utc("2021-10-22 10:00:00");
                countdownName = "Battlefield 2042 Release";
                countdownTimePassed = "Go check #game-news!";
                messageText = "**Battlefield 2042 | Release**\nReleases <t:1634896800:R>";
                buttonOneText = "Game Page";
                buttonOneLink = "https://www.ea.com/games/battlefield/battlefield-2042";
                buttonTwoText = "Pre-Order";
                buttonTwoLink = "https://www.ea.com/games/battlefield/battlefield-2042/buy";

            }

            const currentTime = moment.utc();
            const duration = moment.duration(countdownTime.diff(currentTime));

            const Time = {
                EventName: countdownName,
                MessageText: messageText,
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
                MonthText: function () {
                    if (Time.Month == 1) {
                        return "month";
                    } else {
                        return "months";
                    }
                },
                DaysText: function () {
                    if (Time.Days == 1) {
                        return "day";
                    } else {
                        return "days";
                    }
                },
                HoursText: function () {
                    if (Time.Hours == 1) {
                        return "hour";
                    } else {
                        return "hours";
                    }
                },
                MinutesText: function () {
                    if (Time.Minutes == 1) {
                        return "minute";
                    } else {
                        return "minutes";
                    }
                },
                SecondsText: function () {
                    if (Time.Seconds == 1) {
                        return "second";
                    } else {
                        return "seconds";
                    }
                },
                HasPassed: function () {
                    return countdownTime.isBefore(currentTime);
                },
                CountdownString: function () {

                    if (customText && userId === "99182302885588992") return countdownText;

                    if (this.HasPassed()) {
                        return countdownTimePassed;
                    }

                    if (duration._milliseconds < 60000) { // Less than a minute left
                        return `${Time.Seconds} ${Time.SecondsText()}`;
                    }

                    if (duration._milliseconds < 3600000) { // Less than an hour left
                        return `${this.Minutes} ${this.MinutesText()}, ${Time.Seconds} ${Time.SecondsText()}`;
                    }
					
					if (duration._milliseconds < 21600000) { // Less than 6 hours left
                        return `${this.Hours} ${this.HoursText()}, ${this.Minutes} ${this.MinutesText()}, ${Time.Seconds} ${Time.SecondsText()}`;
                    }

                    if (duration._milliseconds < 86400000) { // Less than a day left
                        return `${this.Hours} ${this.HoursText()}, ${this.Minutes} ${this.MinutesText()}`;
                    }

                    if (duration._milliseconds >= 86400000 && duration._milliseconds < 2592000000) { // More than a day and less than a month
                        return `${this.Days} ${this.DaysText()}, ${this.Hours} ${this.HoursText()}, ${this.Minutes} ${this.MinutesText()}`;
                    }
                                        
                    // More than a month left
                    return `${this.Months} ${this.MonthText()}, ${this.Days} ${this.DaysText()}, ${this.Hours} ${this.HoursText()}`
                },
                // CountdownImage: function () {

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

            client.commands.get("countdowncanvas").execute(message, args, client, Discord, Time);

        } catch (err) {
            console.error(err);
        }
    }
};