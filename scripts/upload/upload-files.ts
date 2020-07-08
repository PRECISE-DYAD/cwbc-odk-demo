import * as path from "path";
import * as md5File from "md5-file";
import { recFind } from "../utils";
import {
  APP_CONFIG_PATH,
  parseCSV,
  writeCSV,
  deleteFilesFromServer,
  uploadLocalFilesToServer,
} from "./upload-utils";
import http from "./http";
import { IManifestItem } from "./odkRest/odk.types";
import { OdkRestService } from "./odkRest/odk.rest";

type IManifestHash = { [filename: string]: IManifestItem };

const odkRest = new OdkRestService();

/**
 * Compare the manifest of files on the server and files in local app
 * for both tables and static assets.
 * Upload new or modified files, delete files that no longer exist
 */
export async function uploadFiles() {
  //  NOTE - want to handle all files together as server manifest keeps some of the
  // assets files with the tables manifest (table csvs)
  const allLocalFiles = await recFind(`${APP_CONFIG_PATH}`);
  const processedLocalFiles = await processLocalFiles(allLocalFiles);
  const serverTableFiles = await getServerTableFiles();
  const serverAppFiles = (await odkRest.getAppLevelFileManifest()).files;
  const allServerFiles = [...serverTableFiles, ...serverAppFiles];
  const compare = await compareFiles(allServerFiles, processedLocalFiles);
  console.log("delete", compare.delete.length);
  console.log(compare.delete);
  console.log("upload", compare.upload.length);
  console.log(compare.upload);
  console.log("ignore", compare.ignore.length);
  await deleteFilesFromServer(compare.delete.map((el) => el.filepath));
  await uploadLocalFilesToServer(
    compare.upload.map((el) => path.join(APP_CONFIG_PATH, el.filepath))
  );
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
 * The server keeps track of specific table files through a different
 * api, which needs to be called for each table
 */
async function getServerTableFiles() {
  const serverTablesMeta = await http.get("default/tables");
  if (serverTablesMeta.hasMoreResults) {
    //   TODO - handle 'hasMoreResults case'
    throw new Error("App not setup to handle table batch");
  }
  const serverTables = serverTablesMeta.tables.map((m) => m.tableId);
  let serverTableFiles = [];
  for (let tableId of serverTables) {
    const tableFiles = (await odkRest.getTableIdFileManifest(tableId)).files;
    serverTableFiles = [...serverTableFiles, ...tableFiles];
  }
  return serverTableFiles;
}
/**
 * Decide which server files to delete (not in local) and local files
 * to update (not in server or different md5hash)
 */
async function compareFiles(
  serverFiles: IManifestItem[],
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
  const actions = { ignore: [], upload: [], delete: [] };
  Object.entries(serverFileHash).forEach(([key, value]) => {
    const filepath = key;
    const serverMD5 = value;
    const localMD5 = localFileHash[key];
    if (localFileHash[key] !== value) {
      actions.delete.push({ filepath, serverMD5, localMD5 });
    }
  });
  Object.entries(localFileHash).forEach(([key, value]) => {
    const filepath = key;
    const serverMD5 = serverFileHash[key];
    const localMD5 = value;
    if (serverMD5 !== localMD5) {
      actions.upload.push({ filepath, serverMD5, localMD5 });
    } else {
      actions.ignore.push({ filepath, serverMD5, localMD5 });
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
