import axios from "axios";
require("dotenv").config();
import { recFind } from "./utils";
import * as path from "path";
import { readFile } from "fs-extra";
const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");

const username = process.env.ODK_USERNAME;
const password = process.env.ODK_PASSWORD;
const baseUrl = `${process.env.ODK_SERVER_URL}/odktables`;

// upload build assets to server
// similar to SyncClient.java
async function uploadBuild() {
  // TODO - compare local files to server and only upload different
  // delete old
  const serverFiles = await getServerAssetsBuildFiles();
  for (let s of serverFiles) {
    const url = `${baseUrl}/default/files/2/${s.filename}`;
    const res = await axios.delete(url, { auth: { username, password } });
    console.log(`${res.status} - ${s.filename}`);
  }
  // upload new
  const localFilePaths = await getLocalBuildFiles();
  for (let p of localFilePaths) {
    const relativeName = `assets/${path
      .relative(designerAssetsPath, p)
      .split("\\")
      .join("/")}`;
    const ext = p.split(".").pop();
    const contentType = mimeMapping[ext]
      ? mimeMapping[ext]
      : "application/octet-stream";

    const res = await uploadFile(p, relativeName, contentType);
    console.log(`${res.status} - ${relativeName}`);
  }
}

/**
 *  Send post request with buffer data and appropriate headers
 *  for odk server to interpret
 */
async function uploadFile(
  filepath: string,
  relativePathOnServer: string,
  contentType: string
) {
  const fileData = await readFile(filepath);
  return axios.post(
    `${baseUrl}/default/files/2/${relativePathOnServer}`,
    fileData,
    {
      auth: { username, password },
      headers: {
        "content-type": contentType + "; charset=utf-8",
        accept: contentType,
        "accept-charset": "utf-8",
        "X-OpenDataKit-Version": "2.0",
      },
    }
  );
}

async function getLocalBuildFiles() {
  const paths: string[] = await recFind(`${designerAssetsPath}/build`);
  return paths;
}

async function getServerAssetsBuildFiles() {
  const manifest = await getManifest();
  const files = manifest.filter(
    (item) => item.filename.indexOf("assets/build") === 0
  );
  console.log("files", files.length);
  return files;
}

async function getManifest() {
  const res = await get<{ files: IManifestItem[] }>(
    `${baseUrl}/default/manifest/2`
  );
  return res.files;
}
async function get<T = any>(url: string) {
  const res = await axios.get(url, { auth: { username, password } });
  if (res.status === 200) {
  } else {
    console.error(res);
    throw new Error("request failed, see console logs");
  }
  return res.data as T;
}
uploadBuild()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });

// TODO - merge with standalone api methods
/** Types and interfaces */
interface IManifestItem {
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

// example java script:
// java -jar suitcase.jar -upload -dataVersion "2" -cloudEndpointUrl "https://..." -appId "default" -username "..." -password "..." -path "cwbc-odkx-app/designer/app/config/assets/build/index.html" -relativeServerPath "assets/build/index.html" -uploadOp "FILE" --force
