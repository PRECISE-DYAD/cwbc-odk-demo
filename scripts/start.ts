import * as path from "path";
import * as fs from "fs-extra";
import { promptOptions, runPrepare } from "./utils";
import { spawn } from "child_process";
const BIN_PATH = path.join(process.cwd(), "node_modules/.bin");

/**
 * Handle start of different applications, showing a prompt
 * if none are specified
 * @example npm run start designer
 * @argument --watch: include watch for live form changes
 */
async function main() {
  const selectedScript: string = await promptOptions(
    [
      "Start  - start a local development server",
      "Build  - create a production build for upload or deployment to device",
      "Deploy - deploy to a local device",
      "Upload - upload to odkx-sync",
      "Export - download data from an odkx-sync server for local use",
      "Tasks  - run a predefined defined task script",
    ],
    "Which script do you want to start?"
  );
  const script = selectedScript.split(" - ")[0].toLowerCase();
  if (script !== "start") {
    return spawn("npm", ["run", script], {
      stdio: ["inherit", "inherit", "inherit"],
      shell: true,
    });
  }
  const site = await promptOptions(
    ["kenya", "gambia", "staging"],
    "Which configuration do you wish to use?"
  );
  runPrepare();
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
async function startFrontend(site: string) {
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
function setFrontendEnvironment(site: string) {
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
