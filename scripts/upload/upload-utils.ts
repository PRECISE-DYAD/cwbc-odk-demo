import * as path from "path";
import * as Papa from "papaparse";
import { readFile, writeFile } from "fs-extra";
import http from "./http";

export const APP_CONFIG_PATH = path.join(process.cwd(), "designer/app/config");

export async function uploadLocalFilesToServer(localPaths: string[]) {
  const promises = localPaths.map(async (p) => {
    const contentType = getMimetype(p);
    const serverPath = path
      .relative(`${APP_CONFIG_PATH}`, p)
      .split("\\")
      .join("/");
    const fileData = await readFile(p);
    return uploadAppFileToServer(serverPath, fileData, contentType);
  });
  await Promise.all(promises);
}
export async function deleteFilesFromServer(serverPaths: string[]) {
  const promises = serverPaths.map(async (p) => {
    await http.del(`default/files/2/${p}`);
  });
  await Promise.all(promises);
}

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

/**
 *  Send post request with buffer data and appropriate headers
 *  for odk server to interpret
 */
async function uploadAppFileToServer(
  relativePathOnServer: string,
  fileData: Buffer,
  contentType: string
) {
  // app files and table files have different endpoints
  return http.post(`default/files/2/${relativePathOnServer}`, fileData, {
    "content-type": contentType + "; charset=utf-8",
    accept: contentType,
    "accept-charset": "utf-8",
  });
}

export function getMimetype(filename: string) {
  const ext = filename.split(".").pop();
  return mimeMapping[ext] ? mimeMapping[ext] : "application/octet-stream";
}

// List of mime types, copied from syncClient.java
const mimeMapping = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  pbm: "image/x-portable-bitmap",
  ico: "image/x-icon",
  bmp: "image/bmp",
  tiff: "image/tiff",

  mp2: "audio/mpeg",
  mp3: "audio/mpeg",
  wav: "audio/x-wav",

  asf: "video/x-ms-asf",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  mpa: "video/mpeg",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  mp4: "video/mp4",
  qt: "video/quicktime",

  css: "text/css",
  htm: "text/html",
  html: "text/html",
  csv: "text/csv",
  txt: "text/plain",
  log: "text/plain",
  rtf: "application/rtf",
  pdf: "application/pdf",
  zip: "application/zip",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  docx:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xml: "application/xml", // does not assume UTF-8
  js: "application/x-javascript",
  json: "application/json", // assumes UTF-8
};
