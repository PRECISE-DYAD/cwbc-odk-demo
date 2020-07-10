import * as fs from "fs-extra";

import { APP_CONFIG_PATH, parseCSV } from "./upload-utils";
import { OdkRestService } from "./odkRest/odk.rest";
import {
  IFileUploadActions,
  prepareFileUploadActions,
  processFileUploadActions,
} from "./upload-files";
import { IODKTypes as IODK } from "./odkRest/odk.types";
import { generateUUID } from "./odkRest/odk.utils";

const odkRest = new OdkRestService();

/**
 * Generate a list of all local table definitions and server definitions
 * Compare manifest files for each, and generate a summary of tables to
 * create, update, delete or ignore accordingly
 * Upload corresponding table asset files
 */
export async function prepareTableUploadActions() {
  const actions: ITableUploadAction[] = [];
  const localTableIds = fs
    .readdirSync(`${APP_CONFIG_PATH}/tables`, { withFileTypes: true })
    .filter((p) => p.isDirectory())
    .map((p) => p.name);
  const serverTables = (await odkRest.getTables()).tables;
  const serverTableIDs = serverTables.map((t) => t.tableId);
  // Table CREATE
  for (let tableId of localTableIds) {
    if (!serverTableIDs.includes(tableId)) {
      const schemaOp = "CREATE";
      // create placeholder schema for use in row upload ops
      const uuid = generateUUID();
      const schema = { schemaETag: uuid, dataETag: null, tableId } as any;
      const fileOps = await prepareFileUploadActions(tableId);
      actions.push({ tableId, schemaOp, schema, fileOps });
    }
  }
  // Table DELETE, UPDATE and IGNORE
  for (let schema of serverTables) {
    let schemaOp: ITableUploadAction["schemaOp"];
    const { tableId } = schema;
    const fileOps = await prepareFileUploadActions(tableId);
    if (!localTableIds.includes(tableId)) {
      schemaOp = "DELETE";
    } else {
      // check fileOps to see if definition changed
      const definitionPath = `tables/${tableId}/definition.csv`;
      const schemaUpdated = fileOps.upload.includes(definitionPath);
      schemaOp = schemaUpdated ? "UPDATE" : "IGNORE";
    }
    actions.push({ tableId, schemaOp, schema, fileOps });
  }
  return actions;
}

/**
 * Compare local and server tables, create/delete/update as required table schema
 * and data
 */
export async function processTableUploadActions(actions: ITableUploadAction[]) {
  for (let action of actions) {
    const { schemaOp, tableId, fileOps } = action;
    // schema will change if created (passed etags ignored)
    let { schema } = action;
    // Handle schema
    switch (schemaOp) {
      case "CREATE":
        schema = await createServerTable(tableId);
        break;
      case "DELETE":
        const { schemaETag } = schema;
        await deleteServerTable(tableId, schemaETag);
        break;
      case "IGNORE":
        break;
      case "UPDATE":
        // TODO - handle schema change
        throw new Error("schema changes are not currently supported");
        break;
    }
    // Handle files
    if (action.fileOps) {
      await processFileUploadActions(action.fileOps);
    }
  }
}

/**
 * Upload table schema and data rows
 * @param schemaETag - can be generated using odk.utils function
 */
async function createServerTable(tableId: string) {
  // upload table schema
  const tableDefPath = `${APP_CONFIG_PATH}/tables/${tableId}/definition.csv`;
  const orderedColumns = await parseCSV<IODK.ISchemaColumn>(tableDefPath, {
    transformHeader: (h) => _snakeToCamel(h),
  });
  const schema = { tableId, orderedColumns };
  const table = await odkRest.createTable(schema);
  return table;
}

async function deleteServerTable(tableId: string, schemaETag: string) {
  return odkRest.deleteTable(tableId, schemaETag);
}

// convert snake_case to camelCase (lower case first)
function _snakeToCamel(str: string): string {
  const UpperCamel = str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
  return UpperCamel.charAt(0).toLowerCase() + UpperCamel.slice(1);
}

export interface ITableUploadAction {
  tableId: string;
  schemaOp: "CREATE" | "UPDATE" | "DELETE" | "IGNORE";
  schema?: IODK.ITableMeta;
  fileOps?: IFileUploadActions;
}
