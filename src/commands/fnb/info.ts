import createCommand from "#utils/createCommand.js";

export default createCommand({
  name: "fnb_info",
  enabled: true,
  isPublic: true,
  execute: (interaction) => {
    interaction.reply({
      content:
        "**#FridayNightBattlefield** is a weekly event where players get together to play Battlefield in a friendly atmosphere with DICE developers and Electronic Arts staff. It is a long-standing event with deep roots in the Battlefield community. The event is hosted in multiple languages, has many dedicated servers for everyone to join in on. For more information, look in <#907954362637234246>.\n\n**#FridayNightBattlefield channels:**\n:flag_gb: English: <#961663692787822623> :speaker: <#907955317634109441>\n:flag_de: German: <#961663995872411668> :speaker: <#907955543040208916>\n:flag_fr: French: <#961664034439045150> :speaker: <#908477875458568213>\n:flag_es: Spanish: <#961664072632369182> :speaker: <#907955523985473556>",
    });
  },
});
