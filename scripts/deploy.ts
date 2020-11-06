import * as child from "child_process";
import * as fs from "fs-extra";
import { promptOptions } from "./utils";

const APP_ASSETS_FOLDER = "designer/app/config/assets";
const FORMS_CSV_FOLDER = "forms/csv";

/**
 *
 */
async function main() {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "This will deploy the current app to a device for testing purposes",
    "\n"
  );
  const deployType = await promptOptions(
    ["Frontend app only", "Frontend and forms"],
    "What would you like to deploy"
  );
  if (deployType === "Frontend app only") {
    fs.removeSync(`${APP_ASSETS_FOLDER}/tables.init`);
    fs.removeSync(`${APP_ASSETS_FOLDER}/app.properties`);
    fs.removeSync(`designer/app/config/tables`);
    child.spawnSync("npx grunt adbpush-default-app", {
      stdio: "inherit",
      cwd: "./designer",
      shell: true,
    });
  } else {
    fs.removeSync(`${APP_ASSETS_FOLDER}/csv`);
    const useCsvData = await promptOptions(
      ["no data", "data from csv folder"],
      "Do you wish to csv data rows?"
    );
    if (useCsvData === "data from csv folder") {
      fs.copySync(FORMS_CSV_FOLDER, `${APP_ASSETS_FOLDER}/csv`);
    }

    child.spawnSync("npx grunt adbpush", {
      stdio: "inherit",
      cwd: "./designer",
      shell: true,
    });
  }

  console.log(
    "\x1b[33m%s\x1b[0m",
    "Deploy complete, open tables on device",
    "\n"
  );
}

main();
