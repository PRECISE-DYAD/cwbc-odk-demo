const inquirer = require("inquirer");
const { spawn } = require("child_process");

/**
 * Handle start of different applications, showing a prompt
 * if none are specified
 * @example npm run start designer
 * @argument --watch: include watch for live form changes
 */
function main() {
  const shouldWatch = process.argv.includes("--watch");
  if (shouldWatch) {
    watchFormChanges();
  }
  const appName = process.argv.pop();
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
  spawn("grunt", {
    cwd: "./designer",
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}
function startFrontend() {
  spawn("npm", ["run", "start"], {
    cwd: "./frontend",
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}
function watchFormChanges() {
  return spawn("node", ["scripts/watch.js"], {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}
function promptInput() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "appSelected",
        message: "Select application",
        choices: ["frontend", "designer"],
      },
    ])
    .then(({ appSelected }) => {
      child.spawn("npm", ["run", "start", appSelected], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });
    });
}
main();
