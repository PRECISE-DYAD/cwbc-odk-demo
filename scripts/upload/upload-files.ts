import * as path from "path";
import * as md5File from "md5-file";
import * as fs from "fs-extra";
import { recFind } from "../utils";
import { APP_CONFIG_PATH, parseCSV, writeCSV } from "./upload-utils";
import { IODKTypes as IODK } from "./odkRest/odk.types";
import { OdkRestService } from "./odkRest/odk.rest";

type IManifestHash = { [filename: string]: IODK.IManifestItem };
const odkRest = new OdkRestService();

/**
 * Compare server and local files for table or app assets,
 * return list of upload, delete or ignore actions
 * @param tableId - if specified will upload from table folder instead of assets
 */
export async function prepareFileUploadActions(tableId?: string) {
  const localFiles = listLocalFiles(tableId);
  const processedLocalFiles = await processLocalFiles(localFiles);
  const serverAppFiles = tableId
    ? (await odkRest.getTableIdFileManifest(tableId)).files
    : (await odkRest.getAppLevelFileManifest()).files;
  const actions = await compareFiles(serverAppFiles, processedLocalFiles);
  return actions;
}

export async function processFileUploadActions(actions: IFileUploadActions) {
  await uploadLocalFilesToServer(actions.upload);
  await deleteFilesFromServer(actions.delete);
}

/**
 * When listing files for a table or assets it is extra confusing as the table api
 * contains any csvs stored in assets, and similarly assets excludes anything in api.
 * This method generates the correct list for a table or app assets accordingly
 */
function listLocalFiles(tableId?: string) {
  if (tableId) {
    const tableFiles = recFind(`${APP_CONFIG_PATH}/tables/${tableId}`);
    const tableCsvPath = `${APP_CONFIG_PATH}/assets/csv/${tableId}.csv`;
    if (fs.existsSync(tableCsvPath)) {
      tableFiles.push(tableCsvPath);
    }
    return tableFiles;
  } else {
    const files = recFind(`${APP_CONFIG_PATH}/assets`);
    return files.filter((f) => !f.match(/\\csv\\(.)*.csv/gi));
  }
}

async function uploadLocalFilesToServer(filepaths: string[] = []) {
  const promises = filepaths.map(async (p) => {
    const contentType = _getMimetype(p);
    const serverPath = p;
    const localPath = `${APP_CONFIG_PATH}/${p}`;
    const fileData = fs.readFileSync(localPath);
    return odkRest.putFile(serverPath, fileData, contentType);
  });
  await Promise.all(promises);
}

async function deleteFilesFromServer(serverPaths: string[]) {
  const promises = serverPaths.map(async (p) => {
    await odkRest.deleteFile(`default/files/2/${p}`);
  });
  await Promise.all(promises);
}

/**
 * Hacky methods to try align files for upload with default java methods
 * 1. Remove any .gitkeep and .init files (these can break the upload assets)
 * 2. alter properties.csv files
 */
async function processLocalFiles(filepaths: string[]) {
  // filter gitkeep
  const processed = [];
  for (let p of filepaths) {
    const name = path.basename(p);
    if (name === "properties.csv") {
      await convertPropertiesCSV(p);
    }
    if (name !== ".gitkeep" && path.extname(name) !== ".init") {
      processed.push(p);
    }
  }
  return processed;
}

/**
 * Alter properties.csv files as done in services app ProcessAppAndTableLevelData.java L782
 * Converts displayChoicesList type from 'object' to 'array' in csv rows and rewrites csv
 * @TODO Verify any additional conversions required by ProcessAppAndTableLevelData.java
 */
async function convertPropertiesCSV(propertiesFilepath: string) {
  const propertiesJson = await parseCSV<any>(propertiesFilepath);
  const converted = propertiesJson.map((props) => {
    if (props._key === "displayChoicesList" && props._type === "object") {
      props._type = "array";
    }
    return props;
  });
  // Note - when writing back leave empty line at end (odk does it :s)
  await writeCSV(propertiesFilepath, [...converted, []]);
}

/**
 * Decide which server files to delete (not in local) and local files
 * to update (not in server or different md5hash)
 */
async function compareFiles(
  serverFiles: IODK.IManifestItem[],
  localFilePaths: string[]
) {
  const serverFileHash: IManifestHash = _arrayToHash(
    serverFiles,
    "filename",
    "md5hash"
  );
  const localFileHash = {};
  for (let p of localFilePaths) {
    const serverPath = path
      .relative(`${APP_CONFIG_PATH}`, p)
      .split("\\")
      .join("/");
    const md5hash = await md5File(p);
    localFileHash[serverPath] = `md5:${md5hash}`;
  }
  const actions: IFileUploadActions = { delete: [], ignore: [], upload: [] };
  Object.entries(serverFileHash).forEach(([key, value]) => {
    const filepath = key;
    const serverMD5 = value;
    const localMD5 = localFileHash[key];
    if (localMD5 !== serverMD5) {
      actions.delete.push(filepath);
    }
  });
  Object.entries(localFileHash).forEach(([key, value]) => {
    const filepath = key;
    const serverMD5 = serverFileHash[key];
    const localMD5 = value;
    if (serverMD5 !== localMD5) {
      actions.upload.push(filepath);
    } else {
      actions.ignore.push(filepath);
    }
  });
  return actions;
}

/**
 * convert array ['a','b','c'] or [{id:a},{id:b},{id:c}] to hashmap
 * @param objKeyfield - if passing an object specify key used for hash index
 * @param objValField - if passing object, specify a specific value to be mapped
 * (default maps entire object)
 */
function _arrayToHash(arr: any[], objKeyfield?: string, objValField?: string) {
  const hash = {};
  arr.forEach((el) => {
    if (objKeyfield) {
      hash[el[objKeyfield]] = objValField ? el[objValField] : el;
    } else {
      hash[el] = el;
    }
  });
  return hash;
}

function _getMimetype(filename: string) {
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

export interface IFileUploadActions {
  upload: string[];
  ignore: string[];
  delete: string[];
}
interface fileUploadMeta {
  filepath: string;
  serverMD5: any;
  localMD5: any;
}
