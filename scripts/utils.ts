import * as fs from "fs-extra";
import * as path from "path";

/**
 * find files by a given extension recursively, returning full paths
 * */
export async function recFindByExt(
  base: string,
  ext: string,
  files?: string[],
  result?: string[]
) {
  files = files || (await fs.readdir(base));
  result = result || [];
  for (const file of files) {
    const newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      const newFiles = await fs.readdir(newbase);
      result = await recFindByExt(newbase, ext, newFiles, result);
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
export async function recFind(
  base: string,
  files?: string[],
  result?: string[]
) {
  files = files || (await fs.readdir(base));
  result = result || [];
  for (const file of files) {
    const newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      const newFiles = await fs.readdir(newbase);
      result = await recFind(newbase, newFiles, result);
    } else {
      result.push(newbase);
    }
  }
  return result;
}
