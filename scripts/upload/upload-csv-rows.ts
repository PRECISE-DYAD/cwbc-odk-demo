import * as fs from "fs-extra";
import * as path from "path";
import { OdkRestService } from "./odkRest/odk.rest";
import { IODKTypes as IODK } from "./odkRest/odk.types";
import { parseCSV } from "./upload-utils";

const odkRest = new OdkRestService();

/**
 * Read local csv files, check if server schema exists.
 * Record any data fields missing on server (skip) or missing in csv (add)
 */
export async function prepareCSVRowUploadActions(): Promise<
  ICSVRowUploadAction[]
> {
  const csvBase = "forms/csv";
  const csvPaths = fs
    .readdirSync(csvBase)
    .filter((f) => path.extname(f) === ".csv");
  const actions: ICSVRowUploadAction[] = [];
  const tables = (await odkRest.getTables()).tables;
  for (let csvPath of csvPaths) {
    const tableId = path.basename(csvPath, ".csv");
    const schema = tables.find((t) => t.tableId === tableId);
    if (schema) {
      const { schemaETag } = schema;
      const definition = await odkRest.getDefinition(tableId, schemaETag);
      const rowData = await parseCSV<IODK.ICSVTableRow>(
        `${csvBase}/${csvPath}`
      );
      // ignore metadata columns as these will be handled during process
      const csvCols = Object.keys(rowData[0]).filter(
        (c) => c.charAt(0) !== "_"
      );
      const schemaCols = definition.orderedColumns.map((c) => c.elementKey);
      const skipColumns = csvCols.filter((c) => !schemaCols.includes(c));
      const addColumns = schemaCols.filter((c) => !csvCols.includes(c));
      actions.push({ schema, rowData, skipColumns, addColumns });
    }
  }
  return actions;
}

export async function processCSVRowUploadActions(
  actions: ICSVRowUploadAction[]
) {
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
    addColumns.forEach((column) => orderedColumns.push({ column, value: "" }));
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

export interface ICSVRowUploadAction {
  schema: IODK.ITableMeta;
  rowData: IODK.ICSVTableRow[];
  skipColumns: string[];
  addColumns: string[];
}
