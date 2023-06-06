const QRCode = require('qrcode');
const { ApplicationCommandOptionType } = require("discord.js");

const generateQRCode = async (client, interaction) => {
  let filename = interaction.options.getString("filename") || "qrcode";
  let data = interaction.options.getString("data");
  try {
    const qrCodeBuffer = await QRCode.toBuffer(data);
    console.log("\n\n\nNEW QR: ",qrCodeBuffer)
    interaction.reply({ files: [{
      attachment: qrCodeBuffer,
      name: `${filename}.png`
    }]});
    console.log('QR code generated successfully!');
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

module.exports = {
  name: "generateqr",
  description: "generates an QR code based on data given",
  options :[{
    name: "data",
    description: "data to be inserted to the qr code",
    type: ApplicationCommandOptionType.String,
    required: true,
  },
  {
    name: "filename",
    description: "name of the file",
    type: ApplicationCommandOptionType.String,
    required: false,
  }
],
  callback: generateQRCode
}
