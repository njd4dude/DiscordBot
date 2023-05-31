module.exports = async (client, guildId) => {
  console.log('<entered getApplicationCommands');
  let applicationCommands;

  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = await client.application.commmands;
  }
  await applicationCommands.fetch();
  console.log('getApplicationCommands complete!>');
  return applicationCommands;
};
