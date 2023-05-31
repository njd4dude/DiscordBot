const fs = require("fs");
const path = require("path");

module.exports = (directory, foldersOnly = false) => {
  console.log("\n<entered the getAllFiles export");
  let fileNames = [];
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);
    if (foldersOnly) {
      if (file.isDirectory) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }
  console.log(`files of directory(${directory}) => ${fileNames}`);
  console.log("getAllFiles completed!>");
  return fileNames;
};
