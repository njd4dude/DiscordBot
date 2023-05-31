const { ApplicationCommandOptionType } = require("discord.js");
const ytdl = require("ytdl-core");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
let connection;

module.exports = {
  name: "playmusic",
  description: "plays music given the song title",
  options: [
    {
      name: "link",
      description: "Link provided for the music",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply(
        "You must be in a voice channel to use this command."
      );
    }

    try {
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const link = interaction.options.getString("link");
      const stream = ytdl(link, { filter: "audioonly" });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      connection.subscribe(player);
      player.play(resource);

      player.on("error", (error) => {
        console.error(error);
        interaction.reply("There was an error trying to play the song.");
      });

      player.on("stateChange", (state) => {
        if (state.status === "idle") {
          interaction.reply("Finished playing the song.");
          connection.destroy();
        }
      });

      interaction.reply("Playing the song...");
    } catch (error) {
      console.error(error);
      interaction.reply("There was an error trying to play the song.");
    }
  },
  getConnection: () => connection,
};
