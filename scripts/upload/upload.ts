import * as inquirer from "inquirer";
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

/**
 * Upload scripts presents an interactive selection of upload options for file
 * and table resources
 */
async function main() {
  const task = await promptOptions(
    ["App files", "Tables"],
    "What would you like to upload?"
  );
  if (task === "App files") await promptFileUpload();
  if (task === "Tables") await promptTableUpload();
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

async function promptOptions(choices = [], message = "Select an option") {
  const res = await inquirer.prompt([
    { type: "list", name: "selected", message, choices },
  ]);
  return res.selected;
}

function _getTableActionsSummary(actions: ITableUploadAction[]) {
  const tables = actions.map((a) => `[${a.schemaOp}] ${a.tableId}`);
  const files: IFileUploadActions = { delete: [], ignore: [], upload: [] };
  const keys = Object.keys(files);
  actions.forEach((a) => {
    keys.forEach((k) => {
      files[k] = [...files[k], ...a.fileOps[k]];
    });
  });
  return { tables, files };
}

function _getFilesActionsSummary(actions: IFileUploadActions) {
  return actions;
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });
