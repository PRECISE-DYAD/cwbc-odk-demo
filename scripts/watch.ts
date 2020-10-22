import watch from "node-watch";
import * as path from "path";
import * as fs from "fs-extra";
import * as child from "child_process";

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
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
 * When an XLSX file is changed run conversion scripts *
 * TODO - compare md5 of changed and target files to check if conversion required
 */
function processChangedFile(filepath: string) {
  const filename = path.basename(filepath);
  const relativePath = path.relative("forms", filepath);
  let xlsxTargetPath: string;
  let formDefTargetPath: string;
  if (filename === "framework.xlsx") {
    xlsxTargetPath =
      "app/config/assets/framework/forms/framework/framework.xlsx";
  } else {
    xlsxTargetPath = `app/config/tables/${relativePath}`;
  }
  formDefTargetPath = xlsxTargetPath.replace(filename, "formDef.json");
  fs.copySync(filepath, `designer/${xlsxTargetPath}`);
  child.spawnSync(
    `npx grunt exec:macGenConvert:${xlsxTargetPath}:${formDefTargetPath}`,
    {
      cwd: designerPath,
      stdio: ["ignore", "inherit", "inherit"],
      shell: true,
    }
  );
}
