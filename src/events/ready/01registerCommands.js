const { testServer } = require("../../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
require("dotenv").config();

module.exports = async (client) => {
  console.log('\n<entered the 01registerCommands');
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      process.env.GUILD_ID,
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );
      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command: ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log(`edited command ${existingCommand.name}`)
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `Skipping registering command ${name} as its set to delete`
          );
          continue;
        }
        await applicationCommands.create({
          name,
          description,
          options,
        });
        console.log(`Registered command ${name}`);
      }
    }
  } catch (error) {
    console.log(`there was an error: ${error}`);
  }
  console.log("01registerCommands complete!>");
};
