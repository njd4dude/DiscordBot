const {Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const roles = [
  {
    id: "1108188624572387410",
    label: "manager",
  },
  {
    id: "1108189526951727194",
    label: "employee",
  },
];

client.on("ready", async (c) => {
  console.log(`${c.user.tag} is online`);
  try {
    const channel = await client.channels.cache.get("1106326345232949292");
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await channel.send({
      content: "Claim or remove a role from below",
      components: [row],
    });
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
