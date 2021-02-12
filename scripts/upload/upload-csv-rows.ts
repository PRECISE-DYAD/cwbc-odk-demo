import * as chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";
import * as readline from "readline";
import { OdkRestService } from "../odkRest/odk.rest";
import { IODKTypes as IODK } from "../odkRest/odk.types";
import { writeTablesInit } from "../utils";
import { parseCSV } from "./upload-utils";

const odkRest = new OdkRestService();

/**
 * Read local csv files, check if server schema exists.
 * Record any data fields missing on server (skip) or missing in csv (add)
 */
export async function prepareCSVRowUploadActions(): Promise<ICSVRowUploadAction[]> {
  console.log(chalk.blue("This will upload all CSVs from the forms/csv folder"));
  // create a tables.init file to match the existing content
  // NOTE - does not support custom naming or only uploading partial list of csvs
  const existingCSVs = fs
    .readdirSync("forms/csv", { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith(".csv"))
    .map((f) => f.name.replace(".csv", ""));
  writeTablesInit("forms/csv", existingCSVs);

  // previously uploads were based on existing tables.init, although now one is generated
  // this method is slighly redundant (but kept for future compatibility)
  const tablesInit = await _readFileByLine(`forms/csv/tables.init`);
  const csvPaths = tablesInit
    .slice(1)
    .map((p) => p.split("=")[1].replace("config/assets", "forms"));
  const actions: ICSVRowUploadAction[] = [];
  const tables = (await odkRest.getTables()).tables;
  for (let csvPath of csvPaths) {
    const tableId = path.basename(csvPath, ".csv");
    const schema = tables.find((t) => t.tableId === tableId);
    if (schema) {
      const { schemaETag } = schema;
      const definition = await odkRest.getDefinition(tableId, schemaETag);
      const rowData = await parseCSV<IODK.ICSVTableRow>(csvPath);
      const cleanedData = rowData.map((r) => {
        for (let key of Object.keys(r)) {
          if (r[key] === "") {
            r[key] = null;
          }
        }
        return r;
      });

      // ignore metadata columns as these will be handled during process
      const csvCols = Object.keys(cleanedData[0]).filter((c) => c.charAt(0) !== "_");
      const schemaCols = definition.orderedColumns.map((c) => c.elementKey);
      const skipColumns = csvCols.filter((c) => !schemaCols.includes(c));
      const addColumns = schemaCols.filter((c) => !csvCols.includes(c));
      actions.push({ schema, rowData: cleanedData, skipColumns, addColumns });
    }
  }
  return actions;
}

export async function processCSVRowUploadActions(actions: ICSVRowUploadAction[]) {
  for (let action of actions) {
    const { addColumns, skipColumns, schema, rowData } = action;
    const { schemaETag, dataETag, tableId } = schema;
    const rows = convertCSVToODKRow(rowData, skipColumns, addColumns);
    const rowList: IODK.IUploadRowList = { dataETag, rows };
    await odkRest.alterRows(tableId, schemaETag, rowList);
  }
}

/**
 * Convert flat csv format to nested json format, renaming meta columns and
 * other minor refactors.
 * handling mismatches betweenlocal and server column definitions
 * @param skipColumns - These columns from the csv will be ignored
 * @param addColumns - These columns will be added and populated with an empty string
 */
function convertCSVToODKRow(
  rows: IODK.ICSVTableRow[],
  skipColumns: string[],
  addColumns: string[]
): IODK.IUploadTableRow[] {
  return rows.map((r) => {
    // extract column variable data (fields starting without '_')
    // skip columns which do not appear in schema
    const orderedColumns = [];
    Object.entries(r).forEach(([key, value]) => {
      if (key.charAt(0) !== "_" && !skipColumns.includes(key)) {
        orderedColumns.push({ column: key, value });
      }
    });
    // add blank values for missing columns
    addColumns.forEach((column) => orderedColumns.push({ column, value: null }));
    // refactor to match rest of schema
    const filterScope: IODK.IUploadTableRow["filterScope"] = {
      defaultAccess: r._default_access,
      groupModify: r._group_modify,
      groupPrivileged: r._group_privileged,
      groupReadOnly: r._group_read_only,
      rowOwner: r._group_read_only,
    };
    const row: IODK.IUploadTableRow = {
      deleted: r._deleted === "TRUE",
      formId: r._form_id,
      filterScope,
      id: r._id,
      locale: r._locale,
      orderedColumns,
      rowETag: r._row_etag,
      savepointCreator: r._savepoint_creator,
      savepointTimestamp: r._savepoint_timestamp,
      savepointType: r._savepoint_type,
    };
    return row;
  });
}

/**
 * Take an input file and parse lines one by one, returning an array of lines
 */
async function _readFileByLine(filepath: string): Promise<string[]> {
  const tablesInitStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: tablesInitStream,
    crlfDelay: Infinity,
  });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
}

export interface ICSVRowUploadAction {
  schema: IODK.ITableMeta;
  rowData: IODK.ICSVTableRow[];
  skipColumns: string[];
  addColumns: string[];
}
