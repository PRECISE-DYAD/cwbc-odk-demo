import * as path from "path";
import * as fs from "fs-extra";
import { promptOptions } from "./utils";
const { spawn } = require("child_process");
const BIN_PATH = path.join(process.cwd(), "node_modules/.bin");

/**
 * Handle start of different applications, showing a prompt
 * if none are specified
 * @example npm run start designer
 * @argument --watch: include watch for live form changes
 */
async function main() {
  const site = await promptOptions(
    ["kenya", "gambia"],
    "Which configuration do you wish to use?"
  );
  const shouldWatch = process.argv.includes("--watch");
  if (shouldWatch) {
    watchFormChanges();
  }

  const appName = process.argv.pop();
  switch (appName) {
    case "designer":
      return startDesigner();
    case "frontend":
      return startFrontend(site);
    default:
      // start both processes
      startDesigner();
      startFrontend(site);
  }
}
function startDesigner() {
  spawn("npx grunt", {
    cwd: "./designer",
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}
async function startFrontend(site: "kenya" | "gambia") {
  setFrontendEnvironment(site);
  spawn("npm", ["run", "start"], {
    cwd: "./frontend",
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}
/**
 * Copy site-specific environment file to angular default environment, disabling production mode
 * for local development
 */
function setFrontendEnvironment(site: "kenya" | "gambia") {
  const envFolder = "frontend/src/environments";
  const envContent = fs.readFileSync(`${envFolder}/environment.${site}.ts`, {
    encoding: "utf8",
  });
  // update prod environment
  const envUpdated = envContent.replace(
    "production: true",
    "production: false"
  );
  fs.writeFileSync(`${envFolder}/environment.ts`, envUpdated);
}
function watchFormChanges() {
  return spawn(`${BIN_PATH}/ts-node`, ["scripts/watch.ts"], {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}

main();
