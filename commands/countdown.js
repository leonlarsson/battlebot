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

            const currentTime = moment.utc();
            const countdownTime = moment.utc('2021-08-12 15:00:00'); // Time to count down to (UTC)
            const duration = moment.duration(countdownTime.diff(currentTime));

            const countdownName = `Exodus Short Film`;
            const countdownTimePassed = `Go check #game-news!`;
			const messageText = `**Battlefield 2042 | Exodus Short Film**\nPremieres <t:1628780400:R>`

            const Time = {
                EventName: countdownName,
                MessageText: messageText,
                Month: duration.months(),
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
                    return `${this.Month} ${this.MonthText()}, ${this.Days} ${this.DaysText()}, ${this.Hours} ${this.HoursText()}`
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