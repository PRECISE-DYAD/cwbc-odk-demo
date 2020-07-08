import * as Papa from "papaparse";
import * as path from "path";
import * as md5File from "md5-file";
import * as fs from "fs-extra";
import http from "./http";

import { APP_CONFIG_PATH } from "./upload-utils";
import { OdkRestService } from "./odkRest/odk.rest";
import { ITableMeta } from "./odkRest/odk.types";

const odkRest = new OdkRestService();

/**
 * Compare local and server tables, create/delete/update as required table schema
 * and data
 */
export async function uploadTables() {
  const actions = await compareServerAndLocalTables();
  console.log(actions);
  for (const tableId of actions.create) {
    await createServerTable(tableId);
    // upload initial data rows
    const csvPath = `${APP_CONFIG_PATH}/assets/csv/${tableId}.csv`;
    if (fs.existsSync(csvPath)) {
      const rowData = await _parseCSV(csvPath);
      await uploadTableRows(tableId, rowData);
    }
  }
  for (const table of actions.update) {
    const { tableId, schemaETag } = table;
    await updateServerTable(tableId, schemaETag);
  }
  for (const table of actions.delete) {
    const { tableId, schemaETag } = table;
    await deleteServerTable(tableId, schemaETag);
  }
}

/**
 * Generate a list of all local table definitions and server definitions
 * Compare manifest files for each, and generate a summary of tables to
 * create, update, delete or ignore accordingly
 */
async function compareServerAndLocalTables() {
  const actions: IActions = { create: [], update: [], ignore: [], delete: [] };
  const localTableIds = fs
    .readdirSync(`${APP_CONFIG_PATH}/tables`)
    .filter((dir) =>
      fs.existsSync(`${APP_CONFIG_PATH}/tables/${dir}/definition.csv`)
    );
  const serverTables = (await odkRest.getTables()).tables;
  for (let tableId of localTableIds) {
    const serverTable = serverTables.find((t) => t.tableId === tableId);
    if (!serverTable) {
      actions.create.push(tableId);
    } else {
      const TABLE_DIR = `${APP_CONFIG_PATH}/tables/${tableId}`;
      const serverTableFiles = (await odkRest.getTableIdFileManifest(tableId))
        .files;
      const serverTableDefinition = serverTableFiles.find(
        (f) => path.basename(f.filename) === "definition.csv"
      );
      const localMD5 = md5File.sync(`${TABLE_DIR}/definition.csv`);
      const serverMD5 = serverTableDefinition.md5hash;
      if (serverMD5 === `md5:${localMD5}`) actions.ignore.push(tableId);
      else actions.update.push(serverTable);
    }
  }
  // Case 3 - DELETE
  serverTables.forEach((table) => {
    if (!localTableIds.includes(table.tableId)) {
      actions.delete.push(table);
    }
  });
  return actions;
}

/**
 * Upload table schema and data rows
 */
async function createServerTable(tableId: string) {
  // upload table schema
  const tableDefPath = `${APP_CONFIG_PATH}/tables/${tableId}/definition.csv`;
  const orderedColumns = await _parseCSV(tableDefPath, {
    transformHeader: (h) => _snakeToCamel(h),
  });
  const schema = {
    schemaETag: _UUIDv4(),
    tableId,
    orderedColumns,
  };
  await http.put(`default/tables/${tableId}`, schema, {
    "Content-Type": "application/json",
    "X-OpenDataKit-Installation-Id": "X-OpenDataKit-Installation-Id",
  });
  console.log(`[CREATED] - ${tableId}`);
}

async function uploadTableRows(tableId: string, rows: any[]) {
  console.log("uploading rows", tableId, rows);

  throw new Error("Row upload not currently supported");
}

async function deleteServerTable(tableId: string, schemaETag: string) {}

async function updateServerTable(tableId: string, schemaETag: string) {
  const serverTableRows = await odkRest.getRows(tableId, schemaETag);
  console.log("rows", serverTableRows);
  // TODO - handle migration
  throw new Error("Method not complete");
}

async function _parseCSV<T>(
  filepath: string,
  config: Papa.ParseConfig = {}
): Promise<T[]> {
  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
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

interface IActions {
  create: string[];
  ignore: string[];
  update: ITableMeta[];
  delete: ITableMeta[];
}
