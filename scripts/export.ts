import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as archiver from "archiver";
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
    if (
      (await promptOptions(
        ["no", "yes"],
        "Would you like to replace your local forms folder with the exported content?"
      )) === "yes"
    ) {
      await backupLocalFormsFolder();
      copyExportToLocalFormsFolder(exportFolder);
    }
  }
}
function copyExportToLocalFormsFolder(exportFolder: string) {
  fs.removeSync("forms/tables");
  fs.removeSync("forms/csv");
  fs.removeSync("forms/framework");
  fs.copySync(exportFolder, "forms");
  // TODO - populate custom tables init for loading all data
}
/**
 * Create a zip backup of everything in local forms folder
 */
async function backupLocalFormsFolder() {
  return new Promise((resolve, reject) => {
    const stamp = new Date().toISOString().substring(0, 16).split(":").join("");
    const backupPath = `exports/local/forms_${stamp}.zip`;
    fs.createFileSync(backupPath);
    const output = fs.createWriteStream(backupPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw err;
    });
    output.on("close", () => {
      console.log("backup created:", path.join(process.cwd(), backupPath));
      resolve();
    });
    output.on("end", function () {
      console.log("Data has been drained");
    });
    archive.on("warning", function (err) {
      console.error(err);
      if (err.code === "ENOENT") {
      } else {
        // throw error
        throw err;
      }
    });
    archive.on("error", function (err) {
      throw err;
    });
    archive.pipe(output);
    archive.directory("forms/", false);
    archive.finalize();
  });
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
  const tableIds = tables.map((t) => t.tableId);
  writeTablesInit(exportFolder, tableIds);
  console.table(summary);
  console.log("exported to", path.join(process.cwd(), exportFolder));
}
function writeTablesInit(exportFolder: string, tableIds: string[]) {
  const tablesInitPath = `${exportFolder}/csv/tables.init`;
  fs.createFileSync(tablesInitPath);
  fs.appendFileSync(tablesInitPath, `table_keys=${tableIds.join(",")}`);
  for (let tableId of tableIds) {
    const line = `\r\n${tableId}.filename=config/assets/csv/${tableId}.csv`;
    fs.appendFileSync(tablesInitPath, line);
  }
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
