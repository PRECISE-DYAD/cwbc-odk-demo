const inquirer = require("inquirer");
import * as path from "path";
const { spawn } = require("child_process");
const BIN_PATH = path.join(process.cwd(), "node_modules/.bin");

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
      // start both processes
      startDesigner();
      startFrontend();
  }
}
function startDesigner() {
  spawn("npx grunt", {
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
  return spawn(`${BIN_PATH}/ts-node`, ["scripts/watch.ts"], {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}

main();

/**
 * 2020-04-23 Deprecated
 * Previously used to show prompt to start either designer or frontend
 * but now default behaviour is to display both. Keeping purely for reference
 */
// function promptInput() {
//   inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "appSelected",
//         message: "Select application",
//         choices: ["frontend", "designer"],
//       },
//     ])
//     .then(({ appSelected }) => {
//       child.spawn("npm", ["run", "start", appSelected], {
//         stdio: ["ignore", "inherit", "inherit"],
//         shell: true,
//       });
//     });
// }
