import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import { promptOptions, setEnv } from "./utils";
// TODO - refactor to have upload and export scripts and deps as siblings
import { OdkRestService } from "./upload/odkRest/odk.rest";
import { IODKTypes as IODK } from "./upload/odkRest/odk.types";
import { writeCSV } from "./upload/upload-utils";

const odkRest = new OdkRestService();

/**
 * Export table data from the server to local exports folder
 */
async function main() {
  await setEnv();
  const { ODK_SERVER_URL } = process.env;
  if (!ODK_SERVER_URL) {
    throw new Error("ODK_SERVER_URL not specified in .env, aborting export");
  }
  console.log("Exporting tables from ", chalk.bgBlack.yellow(ODK_SERVER_URL));
  const tables = (await odkRest.getTables()).tables;
  console.log(tables.map((t) => t.tableId));
  if (
    (await promptOptions(["no", "yes"], "Do you wish to proceed?")) === "yes"
  ) {
    const serverBase = ODK_SERVER_URL.replace(/(^\w+:|^)\/\//, "");
    const timestamp = new Date().toISOString().substring(0, 10);
    const exportFolder = `exports/${serverBase}/${timestamp}`;
    fs.ensureDirSync(exportFolder);
    fs.emptyDirSync(exportFolder);
    await exportFramework(exportFolder);
    await exportTables(exportFolder, tables);
  }
}

async function exportFramework(exportFolder: string) {
  fs.ensureDirSync(`${exportFolder}/framework`);
  const serverFilePath = `assets/framework/forms/framework/framework.xlsx`;
  const buffer = await odkRest.getFile(serverFilePath);
  fs.writeFileSync(`${exportFolder}/framework/framework.xlsx`, buffer);
}

async function exportTables(exportFolder: string, tables: IODK.ITableMeta[]) {
  fs.ensureDirSync(`${exportFolder}/csv`);
  fs.ensureDirSync(`${exportFolder}/tables`);

  const summary = [];
  for (const table of tables) {
    const { schemaETag, tableId } = table;
    // TODO - move table file exports to separate function and use manifest to fully populate
    const tableAssetBase = `tables/${tableId}/forms/${tableId}`;
    const buffer = await odkRest.getFile(`${tableAssetBase}/${tableId}.xlsx`);
    fs.ensureDirSync(`${exportFolder}/${tableAssetBase}`);
    fs.writeFileSync(
      `${exportFolder}/${tableAssetBase}/${tableId}.xlsx`,
      buffer
    );
    const { rows } = await odkRest.getRows(tableId, schemaETag);
    if (rows.length > 0) {
      const csvData = convertODKRowsToCSV(rows);
      writeCSV(`${exportFolder}/csv/${tableId}.csv`, csvData);
    }
    summary.push({ tableId, "rows exported": rows.length });
  }
  console.table(summary);
  console.log("exported to", path.join(process.cwd(), exportFolder));
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
