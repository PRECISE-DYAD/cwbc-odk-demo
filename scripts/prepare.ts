import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as child from "child_process";
import * as md5File from "md5-file";
import * as boxen from "boxen";
import { recFind, listFolders, recFindByExt, readFileByLine } from "./utils";

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");
const designerTablesPath = path.join(designerPath, "app/config/tables");

/**
 *
 */
async function run() {
  console.log(chalk.blue("Preparing forms..."));
  populateSampleFiles();
  await generateFormdefFiles();
  removeUnusedTables();
  copyCustomTypeTemplates();
  copyCustomHandlebarsTemplates();
  // copy preload data
  ensureCopy("forms/csv", `${designerAssetsPath}/csv`, true);
  fs.moveSync(`${designerAssetsPath}/csv/tables.init`, `${designerAssetsPath}/tables.init`, {
    overwrite: true,
  });
  ensureCopy("forms/app.properties", `${designerAssetsPath}/app.properties`);
  console.log(chalk.green("Prepare complete"));
}
run();

/**
 * Look through form table folders, copy and convert any xlsx files that have
 * not already been converted. Convert framework
 */
async function generateFormdefFiles() {
  const tableFormPaths = recFindByExt("forms/tables", "xlsx").filter(
    (filepath) => !path.basename(filepath).includes("~$")
  );
  for (let formPath of tableFormPaths) {
    await processXlsxFile(formPath);
  }
  await processXlsxFile("forms/framework/framework.xlsx");
}

/**
 * Delete any tables from designer tables folder that no longer exist in forms folder
 * TODO - handle case where multiple forms exist in a table (instead of just removing all)
 */
function removeUnusedTables() {
  const designerFormPaths = recFindByExt(designerTablesPath, "xlsx").filter(
    (filepath) => !path.basename(filepath).includes("~$")
  );
  for (let formPath of designerFormPaths) {
    const relativePath = path.relative(designerTablesPath, formPath);
    if (!fs.existsSync(`forms/tables/${relativePath}`)) {
      const tableId = relativePath.split(path.sep)[0];
      fs.removeSync(`${designerTablesPath}/${tableId}`);
    }
  }
}

/**
 * Compare a form xlsx file with target xlsx file, copying folder content and
 * running formdef generation script if files differ
 */
async function processXlsxFile(filepath: string) {
  const sourceMd5 = await md5File(filepath);
  // compare with existing designer forms
  const filename = path.basename(filepath);
  const relativePath = path.relative("forms", filepath);
  const formFolder = path.dirname(relativePath);
  const appTargetBase =
    filename === "framework.xlsx" ? "app/config/assets/framework/forms" : "app/config";
  const appXLSXTargetPath = path.join(appTargetBase, relativePath);
  const designerXLSXPath = `designer/${appXLSXTargetPath}`;
  const targetMd5 = fs.existsSync(designerXLSXPath) ? await md5File(designerXLSXPath) : null;
  if (sourceMd5 !== targetMd5) {
    // copy and process entire table folder
    const formDefTargetPath = appXLSXTargetPath.replace(filename, "formDef.json");
    const targetFolderPath = `designer/${appTargetBase}/${formFolder}`;
    fs.ensureDir(targetFolderPath);
    fs.emptyDirSync(targetFolderPath);
    fs.copySync(`forms/${formFolder}`, targetFolderPath);
    // call grunt task that converts xlsx file to formdef
    child.spawnSync(`npx grunt exec:macGenConvert:${appXLSXTargetPath}:${formDefTargetPath}`, {
      cwd: designerPath,
      stdio: ["ignore", "inherit", "inherit"],
      shell: true,
    });
    // Ensure formdef parsed correctly, flag error and remove xlsx if not
    try {
      fs.readJSONSync(`designer/${formDefTargetPath}`);
    } catch (error) {
      const errorText = readFileByLine(`designer/${formDefTargetPath}`);
      console.log(
        boxen(
          `
      ${chalk.red("Form Error")}
      ${path.join(process.cwd(), "designer", formDefTargetPath)}

      ${chalk.yellow(errorText[0]).replace("Error: ", "")}
      `,
          { padding: 1, borderColor: "red" }
        )
      );
      // console.error(chalk.red(""));
      // console.log(chalk.red());
      // console.log(chalk.yellow(
      // console.log(chalk.red("==============================================="));
      fs.removeSync(designerXLSXPath);
      process.exit(1);
    }
  }
}

/**
 * Various .sample files have been created to provide example when first checking out the repo.
 * Copy the files to their correct location unless other data already exists there.
 */
function populateSampleFiles() {
  // populate content from demoFolder only if no other tables present
  const tablesExist = fs.existsSync("forms/tables");
  if (!tablesExist) {
    console.log("populating demo");
    const demoFiles = recFind("forms/demo");
    for (let filepath of demoFiles) {
      const relativePath = path.relative("forms/demo", filepath);
      if (!fs.existsSync(`forms/${relativePath}`)) {
        fs.copySync(filepath, `forms/${relativePath}`);
      }
    }
  }
  // additional files to check and create if not existing, {destination:source} mapping
  const otherFiles = {
    ".env": ".env.sample",
    "forms/framework/customPromptTypes.js": "forms/demo/framework/customPromptTypes.js",
    "forms/framework/customScreenTypes.js": "forms/demo/framework/customScreenTypes.js",
  };
  for (let [destination, source] of Object.entries(otherFiles)) {
    if (!fs.existsSync(destination)) {
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
  const srcFiles = fs.readdirSync(srcDir).filter((f) => path.extname(f) === ".js");
  const tableIds = listFolders(designerTablesPath);
  for (let tableId of tableIds) {
    const formFolders = listFolders(`${designerTablesPath}/${tableId}/forms`);
    for (let formFolder of formFolders) {
      const targetDir = `${designerTablesPath}/${tableId}/forms/${formFolder}`;
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
  const templates = fs.readdirSync(srcDir).filter((f) => path.extname(f) === ".handlebars");
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
