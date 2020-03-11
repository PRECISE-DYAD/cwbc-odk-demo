const inquirer = require("inquirer");
const child = require("child_process");

/**
 * Handle start of different applications, showing a prompt
 * if none are specified
 * @example npm run start designer
 */
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
  child.spawn("grunt", {
    cwd: "./designer",
    stdio: ["ignore", "inherit", "inherit"],
    shell: true
  });
}
function startFrontend() {
  child.spawn("npm", ["run", "dev"], {
    cwd: "./frontend",
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
