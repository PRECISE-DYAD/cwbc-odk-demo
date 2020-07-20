import * as child from "child_process";
import * as fs from "fs-extra";
import { promptOptions } from "./utils";

const APP_CSV_FOLDER = "designer/app/config/assets/csv";
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
  const useCsvData = await promptOptions(
    ["no data", "data from csv folder"],
    "Do you wish to csv data rows?"
  );
  if (useCsvData === "no data") {
    fs.removeSync(APP_CSV_FOLDER);
  }
  if (useCsvData === "data from csv folder") {
    fs.removeSync(APP_CSV_FOLDER);
    fs.copySync(FORMS_CSV_FOLDER, APP_CSV_FOLDER);
  }
  child.spawnSync("npx grunt adbpush", {
    stdio: "inherit",
    cwd: "./designer",
    shell: true,
  });
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Deploy complete, open tables on device",
    "\n"
  );
}

main();
