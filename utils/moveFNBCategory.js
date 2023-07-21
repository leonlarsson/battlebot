// eslint-disable-next-line no-unused-vars
import { Client, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { CronJob } from "cron";

/** 
 * Starts cron jobs to activate and deactivate the FNB category.
 * @param {Client} client The client.
*/
export const startFNBCategoryCronJobs = client => {
    try {
        // Activate FNB category every Friday at 15:00
        const test = new CronJob("00 15 * * FRI", () => activateFNB(client), null, true, "Europe/Stockholm");
        // Deactivate FNB category every Saturday at 12:00
        new CronJob("00 12 * * SAT", () => deactivateFNB(client), null, true, "Europe/Stockholm");

        console.log("activateFNB next date:", test.nextDate());
    } catch (error) {
        console.log("Error in startFNBCategoryCronJobs():", error);
    }
}

/**
 * Activates the FNB event.
 * @param {Client} client The client.
 * @param {ChatInputCommandInteraction=} interaction The interaction, if entry was a command.
 */
export const activateFNB = (client, interaction) => {

    console.log(interaction ? `${interaction.user.username} (${interaction.user.id}) requested to activate FNB category.` : "Started automatic activation of the FNB category.");

    const confirmationChannel = client.channels.cache.get("907954411970658335"); // #fnb-bfd-staff
    const fnbCategory = client.channels.cache.get("907954291732512799");

    if (!fnbCategory) {
        interaction ? interaction.reply({ content: "Could not find category.", ephemeral: true }) : confirmationChannel.send("**Automatic FNB activation:**\nCould not find category.");
        return console.log("Failed to find FNB category.");
    }

    const moveFNB = fnbCategory.setPosition(6, { reason: interaction ? `${interaction.user.username} asked me to activate the FNB category.` : "Automatic activation of the FNB category." });
    const changePerms = fnbCategory.permissionOverwrites.edit(fnbCategory.guild.roles.everyone, { [PermissionFlagsBits.Connect]: null }, { reason: interaction ? `${interaction.user.username} asked me to activate the FNB category.` : "Automatic activation of the FNB category." });

    Promise.all([moveFNB, changePerms])
        .then(() => interaction ? interaction.reply("✅ FNB category activated.") : confirmationChannel.send("**Automatic FNB activation:**\n✅ FNB category activated."))
        .catch(e => {
            interaction ? interaction.reply("❌ Failed to activate the FNB category.") : confirmationChannel.send("**Automatic FNB activation:**\n❌ Failed to activate the FNB category.");
            console.log(e.message);
        });
}

/**
 * Deactivates the FNB event.
 * @param {Client} client The client.
 * @param {ChatInputCommandInteraction=} interaction The interaction, if entry was a command.
 */
export const deactivateFNB = (client, interaction) => {

    console.log(interaction ? `${interaction.user.username} (${interaction.user.id}) requested to deactivate FNB category.` : "Started automatic deactivation of the FNB category.");

    const confirmationChannel = client.channels.cache.get("907954411970658335"); // #fnb-bfd-staff
    const fnbCategory = client.channels.cache.get("907954291732512799");

    if (!fnbCategory) {
        interaction ? interaction.reply({ content: "Could not find category.", ephemeral: true }) : confirmationChannel.send("**Automatic FNB deactivation:**\nCould not find category.");
        return console.log("Failed to find FNB category.");
    }

    const moveFNB = fnbCategory.setPosition(9, { reason: interaction ? `${interaction.user.username} asked me to deactivate the FNB category.` : "Automatic deactivation of the FNB category." });
    const changePerms = fnbCategory.permissionOverwrites.edit(fnbCategory.guild.roles.everyone, { [PermissionFlagsBits.Connect]: false }, { reason: interaction ? `${interaction.user.username} asked me to deactivate the FNB category.` : "Automatic deactivation of the FNB category." });

    Promise.all([moveFNB, changePerms])
        .then(() => {
            interaction ? interaction.reply("✅ FNB category deactivated.") : confirmationChannel.send("**Automatic FNB deactivation:**\n✅ FNB category deactivated.");
        })
        .catch(e => {
            interaction ? interaction.reply("❌ Failed to deactivate the FNB category.") : confirmationChannel.send("**Automatic FNB deactivation:**\n❌ Failed to deactivate the FNB category.");
            console.log(e.message);
        });
}