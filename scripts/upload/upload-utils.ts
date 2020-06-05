import * as path from "path";
import { readFile } from "fs-extra";
import http from "./http";

export const APP_PATH = path.join(process.cwd(), "designer/app/config");

export async function uploadLocalFilesToServer(localPaths: string[]) {
  const promises = localPaths.map(async (p) => {
    const contentType = getMimetype(p);
    const serverPath = path.relative(`${APP_PATH}`, p).split("\\").join("/");
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

/**
 * Return app or table level file manifest
 * @param tableId - if provided will return table manifest
 */
export async function getManifest(tableId: string = "") {
  const endpoint = `default/manifest/2/${tableId}`;
  const res = await http.get<{ files: IManifestItem[] }>(endpoint);
  return res.files;
}

export function getMimetype(filename: string) {
  const ext = filename.split(".").pop();
  return mimeMapping[ext] ? mimeMapping[ext] : "application/octet-stream";
}

// TODO - merge with standalone api methods
/** Types and interfaces */
export interface IManifestItem {
  filename: string;
  contentLength: number;
  contentType: string;
  md5hash: string;
  downloadUrl: string;
}
// copied from syncClient.java
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
