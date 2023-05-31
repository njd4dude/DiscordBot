const { getConnection } = require("./music");

module.exports = {
  name: "stop",
  description: "stops the audio",

  callback: (client, interaction) => {
    connection = getConnection();
    if (connection) {
      connection.destroy();
      interaction.reply("Audio stopped");
    } else {
      interaction.reply("no active connection found");
    }
  },
};
