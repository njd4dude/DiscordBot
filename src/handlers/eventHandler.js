const getAllFiles = require("../utils/getAllFiles");
const path = require("path");

module.exports = (client) => {
  console.log("\n\n\n++++++++++ ENTERED EVENTHANDLER ++++++++++++++");
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  for (const eventFolder of eventFolders) {
    console.log("\nFOLDER: "+ eventFolder);
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);
    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();
    console.log("event name found: "+ eventName);

    client.on(eventName, async (arg) => {
      console.log("\n"+eventName + "* HAS STARTED --------------------");
      for (const eventFile of eventFiles) {
        console.log("\nEventFile: "+ eventFile +" & EventName: "+ eventName);
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
      console.log(eventName + "* HAS ENDED -------------------" );
    });
  }
};
