import { recFind } from "../utils";
import * as Papa from "papaparse";

import * as path from "path";
import { readFile, writeJSON } from "fs-extra";
import http from "./http";
import { uploadLocalFilesToServer, APP_PATH } from "./upload-utils";

export async function uploadTableDefinitions() {
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
