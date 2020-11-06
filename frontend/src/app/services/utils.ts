import * as Papa from "papaparse";

/**
 * Parse csv text to json
 * @param csvText - csv text, as imported via http or other file read methods
 * @param config - optional config overrides
 */
export async function parseCSV<T>(
  csvText: string,
  config: Papa.ParseConfig = {}
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
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
      ...config,
    });
  });
}
