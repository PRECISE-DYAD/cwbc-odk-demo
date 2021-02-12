import * as fs from "fs-extra";
import * as path from "path";
import * as inquirer from "inquirer";
import * as dotenv from "dotenv";
import { spawnSync } from "child_process";

/**
 * Read any files containing a .env in the filename and
 * present as a list with ODK_SERVER_URL entries for selection
 * and population to process.env
 */
export async function setEnv() {
  const envFiles = fs.readdirSync(process.cwd()).filter((f) => f.includes(".env"));
  const parsedEnvFiles = envFiles.map((f) => {
    const e = dotenv.parse(fs.readFileSync(f));
    return { name: `${path.basename(f)}: ${e.ODK_SERVER_URL}`, value: e };
  });
  const selectedEnv = await promptOptions(parsedEnvFiles, "Select Environment (.env file) to use");
  Object.keys(selectedEnv).forEach((k) => {
    process.env[k] = selectedEnv[k];
  });
}
/**
 * Execute the `npm run prepare` script
 */
export function runPrepare() {
  spawnSync("npm run prepare", {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
}

/**
 * find files by a given extension recursively, returning full paths
 * @param ext - file extension (without '.'), e.g. 'xlsx' or 'json'
 * */
export function recFindByExt(base: string, ext: string, files?: string[], result?: string[]) {
  files = files || fs.readdirSync(base);
  result = result || [];
  for (const file of files) {
    const newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      const newFiles = fs.readdirSync(newbase);
      result = recFindByExt(newbase, ext, newFiles, result);
    } else {
      if (file.split(".").pop() === ext) {
        result.push(newbase);
      }
    }
  }
  return result;
}

/**
 * find files recursively, returning full paths
 * */
export function recFind(base: string, files?: string[], result?: string[]) {
  files = files || fs.readdirSync(base);
  result = result || [];
  for (const file of files) {
    const newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      const newFiles = fs.readdirSync(newbase);
      result = recFind(newbase, newFiles, result);
    } else {
      result.push(newbase);
    }
  }
  return result;
}

/**
 * list all folders by name within a given path
 */
export function listFolders(path: string) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export async function promptOptions(choices = [], message = "Select an option") {
  const res = await inquirer.prompt([{ type: "list", name: "selected", message, choices }]);
  return res.selected;
}
export async function promptInput(message: string, defaultValue?: string) {
  const res = await inquirer.prompt([
    { type: "input", message, default: defaultValue, name: "value" },
  ]);
  return res.value;
}

/**
 * Take an input file and return an array of strings representing each line
 */
export function readFileByLine(filepath: string) {
  return (
    fs
      .readFileSync(filepath)
      .toString()
      // handle line breaks for windows and linux
      .replace(/\r\n/g, "\n")
      .split("\n")
  );
}

// TODO - could be made more generic
export function writeTablesInit(outputFolder: string, tableIds: string[]) {
  const tablesInitPath = `${outputFolder}/tables.init`;
  if (fs.existsSync(tablesInitPath)) {
    fs.removeSync(tablesInitPath);
  }
  fs.createFileSync(tablesInitPath);
  fs.appendFileSync(tablesInitPath, `table_keys=${tableIds.join(",")}`);
  for (let tableId of tableIds) {
    const line = `\r\n${tableId}.filename=config/assets/csv/${tableId}.csv`;
    fs.appendFileSync(tablesInitPath, line);
  }
}
