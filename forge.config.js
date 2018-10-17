const path = require("path");
module.exports = {
  make_targets: {
    win32: ["squirrel"],
    darwin: ["zip"],
    linux: ["deb", "rpm"]
  },
  electronPackagerConfig: {
    packageManager: "yarn",
    icon: path.resolve(__dirname, "src", "images", "macos", "acp.icns")
  },
  electronWinstallerConfig: {
    name: "allclassical_player_gui"
  },
  electronInstallerDebian: {},
  electronInstallerRedhat: {},
  github_repository: {
    owner: "Timmehs",
    name: "Tim Sandberg"
  },
  windowsStoreConfig: {
    packageName: "",
    name: "allclassicalplayergui"
  }
};
