import * as fs from "fs-extra";
import * as path from "path";
import * as inquirer from "inquirer";

/**
 * find files by a given extension recursively, returning full paths
 * @param ext - file extension (without '.'), e.g. 'xlsx' or 'json'
 * */
export function recFindByExt(
  base: string,
  ext: string,
  files?: string[],
  result?: string[]
) {
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

export async function promptOptions(
  choices = [],
  message = "Select an option"
) {
  const res = await inquirer.prompt([
    { type: "list", name: "selected", message, choices },
  ]);
  return res.selected;
}
