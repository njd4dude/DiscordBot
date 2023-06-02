const { ApplicationCommandOptionType } = require("discord.js");
const ytdl = require("ytdl-core");
const { spawn } = require("child_process");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} = require("@discordjs/voice");

let connection;

// Function declaration
async function pythonSearch(keywords) {
  console.log("About to start search");
  return new Promise((resolve, reject) => {
    const pythonScript = spawn("python", [
      "./src/commands/misc/musicHelper/searchQuery.py",
      keywords,
    ]);

    pythonScript.stdout.on("data", (data) => {
      const urlSuffix = data.toString();
      const baseUrl = "https://www.youtube.com/";
      const fullLink = baseUrl + urlSuffix;
      resolve(fullLink);
    });

    pythonScript.stderr.on("data", (data) => {
      console.log(`stderr ${data}`);
      reject(data);
    });

    pythonScript.on("close", (code) => {
      console.log(`exited with code ${code}`);
      reject(code);
    });
  });
}

async function playMusic(client, interaction) {
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

    const keywords = interaction.options.getString("keywords");
    console.log(keywords);
    const videoURL = await pythonSearch(keywords); // Await the videoURL
    console.log("VID ", videoURL);

    const stream = ytdl(videoURL, { filter: "audioonly" });
    const resource = createAudioResource(stream, { inlineVolume: true });
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
}


// Function declaration
function getConnection() {
  return connection;
}

module.exports = {
  name: "playmusic",
  description: "plays music given the song title",
  options: [
    {
      name: "keywords",
      description: "Keywords provided for the music",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: playMusic, // Use the declared function
  getConnection: getConnection, // Use the declared function
};
