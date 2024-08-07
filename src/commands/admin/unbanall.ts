import { ButtonStyle, type Collection, ComponentType, type GuildBan, type Snowflake, escapeMarkdown } from "discord.js";
import createCommand from "#utils/createCommand.ts";

const unbanInterval = 500;
const statusMsgEditInterval = 2_000;

export default createCommand({
  name: "admin_unbanall",
  enabled: true,
  isPublic: false,
  allowedUsers: ["99182302885588992"],
  execute: async (interaction) => {
    if (!interaction.guild) {
      interaction.reply({ content: "Guild not found.", ephemeral: true });
      return;
    }

    const usernameFilter = interaction.options.getString("username");
    const reasonFilter = interaction.options.getString("reason");

    await interaction.deferReply();

    const allBans: { userId: string; username: string; reason?: string | null }[] = [];
    let lastBanId = null;

    // Fetch all bans
    do {
      const bans: Collection<Snowflake, GuildBan> = lastBanId
        ? await interaction.guild.bans.fetch({ cache: false, after: lastBanId })
        : await interaction.guild.bans.fetch({ cache: false });
      bans.forEach((ban) => allBans.push({ userId: ban.user.id, username: ban.user.username, reason: ban.reason }));
      lastBanId = bans.lastKey();
    } while (lastBanId);

    // Filter bans
    const matchingBans = allBans.filter((ban) => {
      if (usernameFilter && !reasonFilter) {
        return ban.username.includes(usernameFilter);
      }

      if (reasonFilter && !usernameFilter) {
        return ban.reason?.includes(reasonFilter);
      }

      if (usernameFilter && reasonFilter) {
        return ban.username.includes(usernameFilter) && ban.reason?.includes(reasonFilter);
      }

      return true;
    });

    // Send initial reply
    const replyMsg = await interaction.editReply({
      content: `Found **${allBans.length.toLocaleString("en")}** total banned users.${usernameFilter || reasonFilter ? `\nFiltered down to **${matchingBans.length.toLocaleString("en")}** banned users using the following filters:\n- Username: ${escapeMarkdown(usernameFilter ?? "<not set>")}\n- Reason: ${escapeMarkdown(reasonFilter ?? "<not set>")}` : ""}`,
      components: matchingBans.length
        ? [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  label: `Unban ${matchingBans.length.toLocaleString("en")} users`,
                  customId: "unban_users",
                  style: ButtonStyle.Danger,
                },
              ],
            },
          ]
        : [],
    });

    // Await button click
    const buttonInteraction = await replyMsg
      .awaitMessageComponent({
        filter: (i) => i.customId === "unban_users" && i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: 15_000,
      })
      .catch(() => {
        // Out of time
        replyMsg.edit({ components: [] });
      });

    if (!buttonInteraction) return;

    if (buttonInteraction.customId === "unban_users") {
      await buttonInteraction.update({ components: [] });

      const statusMsg = await interaction.channel?.send("Starting unban process...");

      let unbannedUsers = 0;

      // Update status message
      const interval = setInterval(async () => {
        await statusMsg?.edit({
          content: `:hourglass_flowing_sand: Unbanned **${unbannedUsers.toLocaleString("en")}** users. ${(unbannedUsers / matchingBans.length).toLocaleString("en", { style: "percent", maximumFractionDigits: 1 })} done. ${(matchingBans.length - unbannedUsers).toLocaleString("en")} remaining. ETA: ${(((matchingBans.length - unbannedUsers) * unbanInterval) / 1000 / 60).toLocaleString("en", { maximumFractionDigits: 0 })} minutes.`,
        });

        if (unbannedUsers >= matchingBans.length) {
          clearInterval(interval);
          await statusMsg?.edit(`:white_check_mark: Unbanned **${unbannedUsers.toLocaleString("en")}** users.`);
        }
      }, statusMsgEditInterval);

      // Loop through bans and unban
      for (const { userId } of matchingBans) {
        await interaction.guild.bans.remove(userId, "Unbanned in mass-unban.");
        unbannedUsers++;
        await new Promise((resolve) => setTimeout(resolve, unbanInterval));
      }
    }
  },
});
