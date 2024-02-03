import type { ChatInputCommandInteraction } from "discord.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
dayjs.extend(duration);
import createCommand from "@/utils/createCommand";
import { setCooldown } from "@/utils/handleCooldowns";
import createCountdownCanvas from "@/utils/createCountdownCanvas";

const cooldown = 5_000; // ms: 5 seconds

// THIS CODE IS OLDER THAN BATTLEFIELD 2042. That's why it's pretty shit and it will likely never be run again

export default createCommand<ChatInputCommandInteraction>({
  name: "when",
  enabled: true,
  isPublic: false,
  allowedChannels: ["850376380822323230", "177094649473794049", "845402419038650418"], // #battlefield-2042, #battlefield, #bot-dev
  wrongChannelReply: "This is only available in <#850376380822323230> and <#177094649473794049>",
  cooldown,
  execute: async interaction => {
    // Get user ID from message or interaction
    // const userId = interaction.user.id;
    // if (userId !== "99182302885588992") return interaction.reply({ content: "Come back later.", ephemeral: true }); // Temp locked to me

    try {
      let countdownTime: dayjs.Dayjs,
        countdownName,
        canvasBackground: string,
        countdownPassed_canvasMessage: string,
        countdownPassed_canvasBackground: string,
        countdownMessage;
      const buttons = [];

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
          { label: "Game Page", url: "https://www.ea.com/games/battlefield/battlefield-2042" },
          { label: "Buy", url: "https://www.ea.com/games/battlefield/battlefield-2042/buy" },
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
          { label: "Game Page", url: "https://www.ea.com/games/battlefield/battlefield-2042" },
          { label: "Buy", url: "https://www.ea.com/games/battlefield/battlefield-2042/buy" },
        );
      }

      const currentTime = dayjs();
      const duration = dayjs.duration(countdownTime!.diff(currentTime));

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
        YearsText: () => (Event.Years === 1 ? "year" : "years"),
        MonthsText: () => (Event.Months === 1 ? "month" : "months"),
        DaysText: () => (Event.Days === 1 ? "day" : "days"),
        HoursText: () => (Event.Hours === 1 ? "hour" : "hours"),
        MinutesText: () => (Event.Minutes === 1 ? "minute" : "minutes"),
        SecondsText: () => (Event.Seconds === 1 ? "second" : "seconds"),
        HasPassed: () => countdownTime.isBefore(currentTime),
        CountdownBackground: () => (Event.HasPassed() ? countdownPassed_canvasBackground : canvasBackground),
        CountdownString: () => {
          if (Event.HasPassed()) return countdownPassed_canvasMessage;

          // Less than a minute left
          if (duration.asMinutes() < 1) return `${Event.Seconds} ${Event.SecondsText()}`;

          // Less than an hour left
          if (duration.asHours() < 1)
            return `${Event.Minutes} ${Event.MinutesText()}, ${Event.Seconds} ${Event.SecondsText()}`;

          // Less than 6 hours left
          if (duration.asHours() < 6)
            return `${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}, ${Event.Seconds} ${Event.SecondsText()}`;

          // Less than a day left
          if (duration.asDays() < 1)
            return `${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}`;

          // More than a day and less than a month
          if (duration.asDays() >= 1 && duration.asMonths() < 1)
            return `${Event.Days} ${Event.DaysText()}, ${Event.Hours} ${Event.HoursText()}, ${Event.Minutes} ${Event.MinutesText()}`;

          // More than a month left
          return `${Event.Months} ${Event.MonthsText()}, ${Event.Days} ${Event.DaysText()}, ${Event.Hours} ${Event.HoursText()}`;
        },
      };

      setCooldown(interaction.user.id, "when", new Date().getTime() + cooldown);

      createCountdownCanvas(interaction, Event);
    } catch (err) {
      console.error(err);
    }
  },
});
