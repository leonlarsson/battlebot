import type { Command } from "@/types";
import { activateFNB, deactivateFNB } from "@/utils/moveFNBCategory";
import {
  ChatInputCommandInteraction,
  Client,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

const allowedRoles = ["907750002313539634", "140941611415633920"];

export default {
  name: "fnb_category",
  enabled: true,
  isPublic: true,
  execute: async (
    _client: Client,
    interaction: ChatInputCommandInteraction,
  ) => {
    // Set allowed roles. FNB Staff & Admin (on BFD)
    if (
      !allowedRoles.some(r =>
        (interaction.member as GuildMember | null)?.roles.cache.has(r),
      )
    )
      return interaction.reply({
        content: "You can't use this.",
        ephemeral: true,
      });

    if (interaction.options.getString("action") === "activate") {
      activateFNB(interaction.client, interaction);
    } else {
      deactivateFNB(interaction.client, interaction);
    }
  },
} satisfies Command;
