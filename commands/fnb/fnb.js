module.exports = {
    name: "fnb",
    public: true,
    enabled: true,
    async execute(interaction, client) {

        // Set allowed roles. FNB Staff & Admin (on BFD)
        const allowedRoles = ["907750002313539634", "140941611415633920"];
        if (!allowedRoles.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: "You can't use this.", ephemeral: true });

        // Set FNB category (on BFD)
        await interaction.guild.channels.fetch();
        const fnbCategory = client.channels.cache.get("907954291732512799");

        if (fnbCategory) {
            if (interaction.options.getString("action") === "activate") {
                console.log(`${interaction.user.tag} (${interaction.user.id}) requested to activate FNB category.`);
                const moveFNB = fnbCategory.setPosition(7, { reason: `${interaction.user.tag} asked me to move the FNB category up.` });
                const changePerms = fnbCategory.permissionOverwrites.edit(interaction.guild.roles.everyone, { "CONNECT": null });

                Promise.all([moveFNB, changePerms])
                    .then(() => interaction.reply("✅ FNB category moved up and voice connect permission was enabled."))
                    .catch(e => {
                        interaction.reply("🚫 Failed to move FNB category up or change permissions.");
                        console.log(e.message);
                    });

            } else {
                console.log(`${interaction.user.tag} (${interaction.user.id}) requested to deactivate FNB category.`);
                const moveFNB = fnbCategory.setPosition(11, { reason: `${interaction.user.tag} asked me to move the FNB category down.` });
                const changePerms = fnbCategory.permissionOverwrites.edit(interaction.guild.roles.everyone, { "CONNECT": false });

                Promise.all([moveFNB, changePerms])
                    .then(() => interaction.reply("✅ FNB category moved down and voice connect permission was disabled."))
                    .catch(e => {
                        interaction.reply("🚫 Failed to move FNB category down or change permissions.");
                        console.log(e.message);
                    });
            }
        } else {
            interaction.reply({ content: "Could not find category.", ephemeral: true });
        }

    }
};