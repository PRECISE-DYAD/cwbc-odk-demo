import * as fs from "fs-extra";
import * as path from "path";
import * as child from "child_process";
import { recFind, listFolders } from "./utils";

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");
const frontendPath = path.join(rootPath, "frontend");

function run() {
  console.log("copying data...");
  populateSampleFiles();
  // copy framework and tables
  ensureCopy(
    "forms/framework",
    `${designerAssetsPath}/framework/forms/framework`
  );
  ensureCopy("forms/tables", `${designerPath}/app/config/tables`, true);

  copyCustomTypeTemplates();
  copyCustomHandlebarsTemplates();

  // process forms, call npx in case not installed globally
  child.spawnSync("npx grunt", ["xlsx-convert-all"], {
    cwd: designerPath,
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
  // copy preload data
  ensureCopy("forms/csv", `${designerAssetsPath}/csv`, true);
  fs.moveSync(
    `${designerAssetsPath}/csv/tables.init`,
    `${designerAssetsPath}/tables.init`,
    {
      overwrite: true,
    }
  );
  // clean any office temp files copied
  const tempFilePaths = recFind(`${designerPath}/app/config`).filter((f) =>
    path.basename(f).includes("~$")
  );
  for (let tempFilePath of tempFilePaths) {
    fs.removeSync(tempFilePath);
  }
  /** Possibly deprecated (requires better understanding of app.properties) */
  // await ensureCopy(
  //   "forms/app.properties",
  //   `${designerAssetsPath}/app.properties`
  // );

  // copy back json and csv data in case frontend wants to access
  ensureCopy(`forms/csv`, `${frontendPath}/src/assets/odk/csv`, true);
}
run();

/**
 * Various .sample files have been created to provide example when first checking out the repo.
 * Copy the files to their correct location unless other data already exists there.
 */
function populateSampleFiles() {
  // {destination:source} mapping
  const sampleFiles = {
    "forms/framework/framework.xlsx": "forms/framework/framework.sample.xlsx",
    "forms/csv/tables.init": "forms/csv/tables.sample.init",
    ".env": ".env.sample",
    // "forms/app.properties": "forms/app.sample.properties",
  };
  for (let [destination, source] of Object.entries(sampleFiles)) {
    const exists = fs.existsSync(destination);
    if (!exists) {
      fs.copyFileSync(source, destination);
    }
  }
}

/**
 * By default ODK expects a customPromptTypes.js and customScreenTypes.js file for each form
 * This script copies the `templates/customPromptTypes.js` file to all forms so that they all
 * have access to the same custom prompts and screens
 */
function copyCustomTypeTemplates() {
  const srcDir = "forms/templates";
  const srcFiles = fs
    .readdirSync(srcDir)
    .filter((f) => path.extname(f) === ".js");
  const targetBase = `${designerPath}/app/config/tables`;
  const tableFolders = listFolders(targetBase);
  for (let tableFolder of tableFolders) {
    const formFolders = listFolders(`${targetBase}/${tableFolder}/forms`);
    for (let formFolder of formFolders) {
      const targetDir = `${targetBase}/${tableFolder}/forms/${formFolder}`;
      for (let filename of srcFiles) {
        fs.copySync(`${srcDir}/${filename}`, `${targetDir}/${filename}`);
      }
    }
  }
}
/**
 * Copy all .handlebars files from the templates folder to the app assets directory
 * to allow them to be imported into any form
 */
function copyCustomHandlebarsTemplates() {
  const srcDir = "forms/templates";
  const targetDir = `${designerAssetsPath}/templates`;
  fs.ensureDirSync(targetDir);
  fs.emptyDirSync(targetDir);
  const templates = fs
    .readdirSync(srcDir)
    .filter((f) => path.extname(f) === ".handlebars");
  for (let template of templates) {
    fs.copyFileSync(`${srcDir}/${template}`, `${targetDir}/${template}`);
  }
}

/**
 * Copy files, ensuring target folder exists and overwriting any existing data
 * @param src - source folder to copy from
 * @param dest - destination target folder to copy to
 * @param emptyDir - Optionally empty directory before copy
 */
function ensureCopy(src: string, dest: string, emptyDir = false) {
  const isDirectory = fs.statSync(src).isDirectory();
  const destDirectory = isDirectory ? dest : path.dirname(dest);
  fs.ensureDirSync(destDirectory);
  if (emptyDir) {
    fs.emptyDirSync(dest);
  }
  try {
    fs.copySync(src, dest, { overwrite: true });
  } catch (error) {
    console.error("\x1b[31m", `ERROR: could not copy ${src} -> ${dest}`);
    process.exitCode = 1;
  }
}

/** Deprecated but may want in future - copy form defs back into frontend */

// const jsonFilepaths = await recFindByExt(
//   `${designerPath}/app/config/tables`,
//   "json"
// );
// for (let filepath of jsonFilepaths) {
//   const source = path.resolve(`${designerPath}/app/config`);
//   const dest = `${frontendPath}/src/assets/odk`;
//   const destination = path.normalize(filepath).replace(source, dest);
//   await fs.copy(filepath, destination);
// }
