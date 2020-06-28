import * as Papa from "papaparse";
import * as path from "path";
import * as md5File from "md5-file";
import {
  readFile,
  writeJSON,
  readdirSync,
  existsSync,
  readFileSync,
} from "fs-extra";
import { recFind } from "../utils";
import http from "./http";

import { APP_PATH, getManifest } from "./upload-utils";

export async function uploadTableDefinitions() {
  const localTableIds = readdirSync(`${APP_PATH}/tables`).filter((dir) =>
    existsSync(`${APP_PATH}/tables/${dir}/definition.csv`)
  );
  // TODO - compare list of serverIDs and localIDs (try some sort of subset tool instead of hash maps)
  const serverTableIds = [];
  return;
  // tableIds are given by name of folder
  for (let tableId of localTableIds) {
    const TABLE_DIR = `${APP_PATH}/tables/${tableId}`;
    const serverTableFiles = await getManifest(tableId);
    const serverTableDefinition = serverTableFiles.find(
      (f) => path.basename(f.filename) === "definition.csv"
    );
    // Case 1. - server definition exists
    if (serverTableDefinition) {
      const localMD5 = md5File.sync(`${TABLE_DIR}/definition.csv`);
      const serverMD5 = serverTableDefinition.md5hash;
      console.log("local", localMD5, "server", serverMD5);
      if (serverMD5 === `md5:${localMD5}`) {
        // A) local and server definitions same, do nothing
      } else {
        // B) local changed - attempt data migrate to new table
        // TODO
      }
    }
    // Case 2. new table - simply upload
    else {
      console.log("creating new table", tableId);
      const localDefinitionData = readFileSync(`${TABLE_DIR}/definition.csv`, {
        encoding: "utf-8",
      });
      const orderedColumns = await _definitionToTableSchema(
        localDefinitionData
      );
      const schema = {
        schemaETag: _UUIDv4(),
        tableId,
        orderedColumns,
      };
      // await http.put(`default/tables/${tableId}`, schema, {
      //   "Content-Type": "application/json",
      //   "X-OpenDataKit-Installation-Id": "X-OpenDataKit-Installation-Id",
      // });
      console.log("table created successfully");
    }
  }

  return;

  // TODO - remove existing tables and/or migrate data
  // TODO - check table for change before uplaod
  console.log("uploading tables");
  const localFilePaths = await recFind(`${APP_PATH}/tables`);
  const tableDefPaths = localFilePaths.filter(
    (p: string) => path.basename(p) === "definition.csv"
  );
  for (let p of tableDefPaths) {
    const definition = await readFile(p, { encoding: "utf-8" });
    const orderedColumns = await _definitionToTableSchema(definition);
    const tableId = path.dirname(p).split(path.sep).slice(-1)[0];
    const schema = {
      schemaETag: _UUIDv4(),
      tableId,
      orderedColumns,
    };
    await http.put(`default/tables/${tableId}`, schema, {
      "Content-Type": "application/json",
      "X-OpenDataKit-Installation-Id": "X-OpenDataKit-Installation-Id",
    });
  }
}

async function _definitionToTableSchema(definition: string) {
  return new Promise((resolve, reject) => {
    Papa.parse(definition, {
      complete: (result) => {
        if (result.errors.length > 0) {
          console.error(result.errors);
          writeJSON("scripts/upload/schema-error.json", result.data);
          reject(result.errors);
        }
        resolve(result.data);
      },
      error: (err) => reject(err),
      header: true,
      transformHeader: (h) => _snakeToCamel(h),
      delimiter: ",",
      skipEmptyLines: true,
      encoding: "utf-8",
    });
  });
}

// convert snake_case to camelCase (lower case first)
function _snakeToCamel(str: string): string {
  const UpperCamel = str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
  return UpperCamel.charAt(0).toLowerCase() + UpperCamel.slice(1);
}

// Simple implementation of UUIDv4
// tslint:disable no-bitwise
function _UUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
