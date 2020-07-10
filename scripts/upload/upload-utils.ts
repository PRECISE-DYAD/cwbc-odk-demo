import * as path from "path";
import * as Papa from "papaparse";
import * as fs from "fs-extra";

export const APP_CONFIG_PATH = path.join(process.cwd(), "designer/app/config");

export async function parseCSV<T>(
  filepath: string,
  config: Papa.ParseConfig = {}
): Promise<T[]> {
  const csvText = fs.readFileSync(filepath, { encoding: "utf-8" });
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      complete: (result) => {
        if (result.errors.length > 0) {
          console.error(result.errors);
          fs.writeJSONSync("scripts/logs/csv-error.json", result.data);
          reject(result.errors);
        }
        resolve(result.data);
      },
      error: (err) => reject(err),
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      encoding: "utf-8",
      ...config,
    });
  });
}

export function writeCSV(filepath: string, jsonData: any[]) {
  const csvData = Papa.unparse(jsonData);
  return fs.writeFileSync(filepath, csvData, { encoding: "utf-8" });
}
