const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "bans a person!!",
  //devOnly: Boolean
  //testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "The user to ban.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for ban.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botsPermissions: [PermissionFlagsBits.Administrator],

  callback: (client, interaction) => {
    interaction.reply(`ban...`);
  },
};
