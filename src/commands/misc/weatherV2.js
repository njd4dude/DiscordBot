const { ApplicationCommandOptionType } = require("discord.js");
const endpoint = "https://api.weather.gov/points/{latitude},{longitude}";

module.exports = {
  name: "weather",
  description: "gets the current temperature in a city",
  options: [
    {
      name: "city",
      description: "Enter the city name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      //user inputs location which will then be used in the NOMINATIM API to get the coords(LAT & LONG)
      let location = interaction.options.getString("city");
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
      );
      const data = await response.json();
      const { lat, lon } = data[0];
      const apiUrl = endpoint
        .replace("{latitude}", lat)
        .replace("{longitude}", lon);
      console.log("API URL:", apiUrl);

      //Using weather API we fetch the JSON data(weather) at that given location
      const weatherResponse = await fetch(apiUrl);
      const weatherData = await weatherResponse.json();
      const forecastResponse = await fetch(weatherData.properties.forecast);
      const forecastData = await forecastResponse.json();
      let temperature = forecastData.properties.periods[0].temperature;
      interaction.reply(`Temperature is ${temperature}`);
    } catch (error) {
      console.log("Error", error);
      interaction.reply("City not found!");
    }
  },
};
