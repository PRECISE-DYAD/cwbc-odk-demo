const inquirer = require("inquirer");
const child = require("child_process");
//
const util = require("util");
const exec = util.promisify(require("child_process").exec);
//
function main() {
  const appName = process.argv[2];
  switch (appName) {
    case "designer":
      return startDesigner();
    case "frontend":
      return startFrontend();
    default:
      return promptInput();
  }
}
function startDesigner() {
  // first copy tables data before running
  child.spawn("node", ["scripts/prepare.js"], {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true
  });
  process.chdir("./designer");
  child.spawn("grunt", {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true
  });
}
function startFrontend() {
  process.chdir("./frontend");
  child.spawn("npm", ["run", "dev"], {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true
  });
}
function promptInput() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "appSelected",
        message: "Select application",
        choices: ["frontend", "designer"]
      }
    ])
    .then(({ appSelected }) => {
      child.spawn("npm", ["run", "start", appSelected], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true
      });
    });
}
main();
