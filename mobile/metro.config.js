// Le programme et la logique du defi sont partages avec le site : ils vivent
// dans ../src. Metro doit donc surveiller ce dossier en plus de mobile/.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, "../src/content"), path.resolve(__dirname, "../src/lib")];

module.exports = config;
