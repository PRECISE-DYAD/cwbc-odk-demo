import watch from "node-watch";
import * as path from "path";
import { spawnSync } from "child_process";

const rootPath = process.cwd();
const formsPath = path.join(rootPath, "forms");
/**
 * Automatically watch for changes to form xlsx files
 * and run prepare scripts on change
 */
function main() {
  console.log("Watching for XLSX form changes");
  /**
   * Watch for any changes to xlsx files and process for app designer
   */
  watch(formsPath, { recursive: true }, async function (evt, name) {
    if (name.includes(".xlsx") && !name.includes("~$")) {
      processChangedFile(name);
    }
    // TODO - also add watch for changes to js, handlebars etc. and copy over
    // (no reload required)
  });
}
main();

/**
 * When an XLSX file is changed run conversion scripts
 * Note - prepare script already handles checking individual file change
 * so just run across all files to make thing easier
 */
function processChangedFile(filepath: string) {
  spawnSync(`npm run prepare`, {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}
