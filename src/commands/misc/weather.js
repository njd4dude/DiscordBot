const { spawn } = require("child_process");
const { ApplicationCommandOptionType } = require("discord.js");
require('dotenv').config();

module.exports = {
  name: "weather2",
  description: "gets the weather!",
  options: [
    {
      name: "city",
      description: "Enter the city name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: (client, interaction) => {
    console.log(`user entered ${interaction.options.getString("city")}`);

    //call the python script to run selenium and get the weather
    const pythonScript = spawn("python", [
      "weather.py",
      interaction.options.getString("city"),
      process.env.USER_DIR,
    ]);

    interaction.deferReply();

    //the data here means whatever is printed out to the console in the python script
    pythonScript.stdout.on("data", async (data) => {
      let obj = JSON.parse(data);
      console.log("\n\n\nnDATA------: "+ data);
      console.log("\n\n\nnDATATOSTRING------: "+ data.toString());
      console.log("\n\n\nnOBJ------: "+ obj.temperature);

      await interaction.editReply(
        `Temperature is ${obj.temperature} in ${obj.city}`
      );
    });

    pythonScript.stderr.on("data", (data) => {
      console.log(`stderr ${data}`);
    });

    pythonScript.on("close", (code) => {
      console.log(`\nexited with code ${code}`);
    });
  },
};
