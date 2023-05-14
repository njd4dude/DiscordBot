const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "ping") {
    message.reply("ping");
  }

  if (message.content === "bruh") {
    message.reply("what bruh");
  }
});

client.login(process.env.TOKEN);
