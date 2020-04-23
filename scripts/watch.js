const watch = require("node-watch");
const path = require("path");
const fs = require("fs-extra");
const child = require("child_process");
const { recFindByExt } = require("./utils");

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");
const formsPath = path.join(rootPath, "forms");
/**
 * Automatically watch for changes to form xlsx files
 * and run prepare scripts on change
 */
console.log("Watching for XLSX form changes");

/**
 * Watch for any changes to xlsx files and process for app designer
 */
watch(formsPath, { recursive: true }, async function (evt, name) {
  if (name.includes(".xlsx") && !name.includes("~$")) {
    await processChangedFile(name);
  }
});

/**
 * When an XLSX file is changed we want to process it to convert via
 * ODK designer (same as npm prepare method). As a caveat, there is
 * no exposed single file conversion method, so instead we will
 * temporarily move all other files to convert only the changed file,
 * and then move back
 *
 * TODO - borrows a lot from prepare.js so could be streamlined
 */
async function processChangedFile(name) {
  const updatedFileBasename = path.basename(name);
  // copy basefiles
  fs.copySync(
    "forms/framework.xlsx",
    `${designerAssetsPath}/framework/forms/framework/framework.xlsx`
  );
  fs.copySync("forms/tables", `${designerPath}/app/config/tables`);
  // temporary rename app directory files
  const currentFiles = await recFindByExt(
    `${designerPath}/app/config/tables`,
    "xlsx"
  );
  for (const filepath of currentFiles) {
    const basename = path.basename(filepath);
    if (basename !== updatedFileBasename) {
      fs.moveSync(filepath, `${filepath}_tmp`, { overwrite: true });
    }
  }
  // convert all tables (which will currently only be the updated)
  child.spawnSync("npx grunt", ["xlsx-convert-all"], {
    cwd: designerPath,
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
  // covert back
  const tmpFiles = await recFindByExt(
    `${designerPath}/app/config/tables`,
    "xlsx_tmp"
  );
  for (const filepath of tmpFiles) {
    const basename = path.basename(filepath);
    if (basename === updatedFileBasename) {
      fs.removeSync(filepath);
    } else {
      fs.moveSync(filepath, `${filepath.replace("_tmp", "")}`, {
        overwrite: true,
      });
    }
  }
}
