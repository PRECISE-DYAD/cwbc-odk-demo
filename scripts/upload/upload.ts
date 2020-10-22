import {
  prepareTableUploadActions,
  processTableUploadActions,
  ITableUploadAction,
} from "./upload-tables";
import {
  prepareFileUploadActions,
  IFileUploadActions,
  processFileUploadActions,
} from "./upload-files";
import {
  prepareCSVRowUploadActions,
  processCSVRowUploadActions,
  ICSVRowUploadAction,
} from "./upload-csv-rows";
import { promptOptions, setEnv } from "../utils";

/**
 * Upload scripts presents an interactive selection of upload options for file
 * and table resources
 */
async function main() {
  await setEnv();
  const { ODK_SERVER_URL } = process.env;
  if (!ODK_SERVER_URL) {
    throw new Error("ODK_SERVER_URL not specified in .env, aborting upload");
  }
  const task = await promptOptions(
    ["App files", "Table Definitions", "CSV Table Rows"],
    `Upload to ${ODK_SERVER_URL}`
  );
  if (task === "App files") await promptFileUpload();
  if (task === "Table Definitions") await promptTableUpload();
  if (task === "CSV Table Rows") await promptCSVRowsUpload();
}

async function promptTableUpload() {
  console.log("comparing server and local tables");
  const tableActions = await prepareTableUploadActions();
  console.log("this will perform the following actions:");
  console.log(_getTableActionsSummary(tableActions));
  if (
    (await promptOptions(["no", "yes"], "Do you wish to proceed?")) === "yes"
  ) {
    await processTableUploadActions(tableActions);
  }
}
async function promptFileUpload() {
  console.log("comparing server and local files");
  const fileActions = await prepareFileUploadActions();
  console.log("this will perform the following actions:");
  console.log(_getFilesActionsSummary(fileActions));
  if (
    (await promptOptions(["no", "yes"], "Do you wish to proceed?")) === "yes"
  ) {
    await processFileUploadActions(fileActions);
  }
}
async function promptCSVRowsUpload() {
  console.log("Preparing upload");
  const csvRowActions = await prepareCSVRowUploadActions();
  console.log(_getCSVRowsUploadSummary(csvRowActions));
  if (
    (await promptOptions(["no", "yes"], "Do you wish to proceed?")) === "yes"
  ) {
    await processCSVRowUploadActions(csvRowActions);
  }
}

function _getTableActionsSummary(actions: ITableUploadAction[]) {
  const tables = { CREATE: [], UPDATE: [], DELETE: [], IGNORE: [] };
  actions.map((a) => `[${a.schemaOp}] ${a.tableId}`);
  const files: IFileUploadActions = { delete: [], ignore: [], upload: [] };
  actions.forEach((a) => {
    tables[a.schemaOp].push(a.tableId);
    files.upload = [...files.upload, ...a.fileOps.upload];
    files.delete = [...files.delete, ...a.fileOps.delete];
    files.ignore = [...files.ignore, ...a.fileOps.ignore];
  });
  files.ignore = files.ignore.length as any;
  tables.IGNORE = tables.IGNORE.length as any;
  return { tables, files };
}

function _getFilesActionsSummary(actions: IFileUploadActions) {
  actions.ignore = actions.ignore.length as any;
  return actions;
}
function _getCSVRowsUploadSummary(actions: ICSVRowUploadAction[]) {
  return actions.map((a) => {
    const { addColumns, schema, skipColumns, rowData } = a;
    const { tableId } = schema;
    return { tableId, addColumns, skipColumns, rows: rowData.length };
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });
