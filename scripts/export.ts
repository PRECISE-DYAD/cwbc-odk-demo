import * as fs from "fs-extra";
import * as path from "path";
import { promptOptions } from "./utils";
// TODO - refactor to have upload and export scripts and deps as siblings
import { OdkRestService } from "./upload/odkRest/odk.rest";
import { IODKTypes as IODK } from "./upload/odkRest/odk.types";
import { writeCSV } from "./upload/upload-utils";
require("dotenv").config();
const odkRest = new OdkRestService();

/**
 * Upload scripts presents an interactive selection of upload options for file
 * and table resources
 */
async function main() {
  const { ODK_SERVER_URL } = process.env;
  if (!ODK_SERVER_URL) {
    throw new Error("ODK_SERVER_URL not specified in .env, aborting export");
  }
  const tables = (await odkRest.getTables()).tables;
  console.log("this will export the following tables");
  console.log(tables.map((t) => t.tableId));
  if (
    (await promptOptions(["no", "yes"], "Do you wish to proceed?")) === "yes"
  ) {
    await exportTables(tables);
  }
}

async function exportTables(tables: IODK.ITableMeta[]) {
  const exportBase = `exports/${new Date().toISOString().substring(0, 10)}`;
  fs.ensureDirSync(`${exportBase}/csv`);
  fs.ensureDirSync(`${exportBase}/json`);
  const summary = [];
  for (const table of tables) {
    const { schemaETag, tableId } = table;
    const { rows } = await odkRest.getRows(tableId, schemaETag);
    if (rows.length > 0) {
      fs.writeJSONSync(`${exportBase}/json/${tableId}.json`, rows);
      const csvData = convertODKRowsToCSV(rows);
      writeCSV(`${exportBase}/csv/${tableId}.csv`, csvData);
    }
    summary.push({ tableId, "rows exported": rows.length });
  }
  console.table(summary);
  console.log("exported to", path.join(process.cwd(), exportBase));
}

/**
 * Reverse method of convertCSVToODKRows
 * Copied from odkx-m repo, see for more documentation
 */
function convertODKRowsToCSV(rows: IODK.IResTableRow[]): IODK.ITableRow[] {
  const converted = [];
  rows.forEach((row) => {
    const data: any = {};
    // create mapping for all fields as snake case, and un-nest filtersocpe fields
    const { filterScope } = row;
    Object.entries(filterScope).forEach(([key, value]) => {
      row[`_${_camelToSnake(key)}`] = value;
    });
    Object.entries(row).forEach(([key, value]) => {
      row[`_${_camelToSnake(key)}`] = value;
    });
    const metadataColumns1: IODK.ITableMetaColumnKey[] = [
      "_id",
      "_form_id",
      "_locale",
      "_savepoint_type",
      "_savepoint_timestamp",
      "_savepoint_creator",
      "_deleted",
      "_data_etag_at_modification",
    ];
    // some metadata columns go to front
    metadataColumns1.forEach((col) => (data[col] = row[col]));
    // main data in centre
    row.orderedColumns.forEach((el) => {
      const { column, value } = el;
      data[column] = value;
    });
    const metadataColumns2: IODK.ITableMetaColumnKey[] = [
      "_default_access",
      "_group_modify",
      "_group_privileged",
      "_group_read_only",
      "_row_etag",
      "_row_owner",
    ];
    // other metadata columns go to back
    metadataColumns2.forEach((col) => (data[col] = row[col]));
    converted.push(data);
  });
  return converted;
}

function _camelToSnake(str: string) {
  return str
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + "_" + m[1];
    })
    .toLowerCase();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });