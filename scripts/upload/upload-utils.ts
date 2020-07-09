import * as path from "path";
import * as Papa from "papaparse";
import { readFile, writeFile } from "fs-extra";

export const APP_CONFIG_PATH = path.join(process.cwd(), "designer/app/config");

export async function parseCSV<T>(
  filepath: string,
  config: Papa.ParseConfig = {}
): Promise<T[]> {
  const csvText = await readFile(filepath, { encoding: "utf-8" });
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      ...config,
      complete: (result) => {
        if (result.errors.length > 0) {
          console.error(result.errors);
          reject(result.errors);
        }
        resolve(result.data);
      },
      error: (err) => reject(err),
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      encoding: "utf-8",
    });
  });
}
export async function writeCSV(filepath: string, jsonData: any[]) {
  const csvData = Papa.unparse(jsonData);
  return writeFile(filepath, csvData, { encoding: "utf-8" });
}
