import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as archiver from "archiver";
import { promptInput, promptOptions, setEnv } from "./utils";
// TODO - refactor to have upload and export scripts and deps as siblings
import { OdkRestService } from "./odkRest/odk.rest";
import { IODKTypes as IODK } from "./odkRest/odk.types";
import { writeCSV } from "./upload/upload-utils";
import { convertODKRowsForExport } from "./odkRest/odk.utils";

const odkRest = new OdkRestService();
odkRest.appId = "default";

/**
 * Export table data from the server to local exports folder
 */
async function main() {
  await setEnv();
  const { ODK_SERVER_URL } = process.env;
  if (!ODK_SERVER_URL) {
    throw new Error("ODK_SERVER_URL not specified in .env, aborting export");
  }
  const serverBase = ODK_SERVER_URL.replace(/(^\w+:|^)\/\//, "");
  let exportFolder = new Date().toISOString().substring(0, 10);
  const task = await promptOptions(["Create a new export", "Load an existing export"]);
  // Create Export
  if (task === "Create a new export") {
    console.log("Exporting tables from ", chalk.bgBlack.yellow(ODK_SERVER_URL));
    // add additional suffix to timestamp name if required
    const exportName = await promptInput("Specify a name for the export", exportFolder);
    if (exportName !== exportFolder) {
      exportFolder += `-${exportName}`;
    }
    const tables = (await odkRest.getTables()).tables;
    console.log(tables.map((t) => t.tableId));
    if ((await promptOptions(["no", "yes"], "Do you wish to proceed?")) === "yes") {
      const exportPath = `exports/${serverBase}/${exportFolder}`;
      fs.ensureDirSync(exportPath);
      fs.emptyDirSync(exportPath);
      await exportFramework(exportPath);
      await exportTables(exportPath, tables);
    }
    // Load Existing
  } else {
    const existingExports = fs.readdirSync(`exports/${serverBase}`);
    if (existingExports.length > 0) {
      exportFolder = await promptOptions(existingExports.reverse(), "Select Export");
    } else {
      console.log(chalk.red(`There are no existing exports for ${serverBase}`));
      process.exit(0);
    }
  }
  // Populate local folders
  if (
    (await promptOptions(
      ["no", "yes"],
      "Would you like to replace your local forms folder with the exported content?"
    )) === "yes"
  ) {
    const exportPath = `exports/${serverBase}/${exportFolder}`;
    await backupLocalFormsFolder();
    copyExportToLocalFormsFolder(exportPath);
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
  return new Promise<void>((resolve, reject) => {
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
    try {
      const buffer = await odkRest.getFile(`${tableAssetBase}/${tableId}.xlsx`);
      fs.ensureDirSync(`${exportFolder}/${tableAssetBase}`);
      fs.writeFileSync(`${exportFolder}/${tableAssetBase}/${tableId}.xlsx`, buffer);
    } catch (error) {
      console.log(chalk.red("failed to download table", tableId));
    }

    const { rows } = await odkRest.getRows(tableId, schemaETag);
    if (rows.length > 0) {
      const csvData = convertODKRowsForExport(rows);
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

main()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });
