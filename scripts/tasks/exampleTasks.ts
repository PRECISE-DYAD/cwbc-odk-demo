import * as chalk from "chalk";
import { OdkRestService } from "../odkRest/odk.rest";
import { IODKTypes } from "../odkRest/odk.types";
import { convertODKRowsForExport } from "../odkRest/odk.utils";
import { setEnv } from "../utils";

const odkRest = new OdkRestService();

/**
 * This task retrieves a list of all tables and all rows, which may be useful when performing
 * operations across the entire database
 *
 * This task can be run via `npm run tasks exampleTask`
 */
export async function exampleTask1() {
  // if not already set, this script will populate environment variables
  // such as the ODK_SERVER_URL, USERNAME and PASSWORD
  await setEnv();
  // get a list of all tables
  const tablesResponse = await odkRest.getTables();
  const tables = tablesResponse.tables;
  // log a summary of results in table format
  console.log("tables retrieved");
  console.table(tables.map((t) => ({ id: t.tableId, schemaEtag: t.schemaETag })));
  console.log("fetching rows...");
  // for each table retrive rows and store to a single object
  const tableRows: { [tableId: string]: IODKTypes.IResTableRow[] } = {};
  for (let table of tables) {
    const rowsResponse = await odkRest.getRows(table.tableId, table.schemaETag);
    console.log(chalk.yellow(`[${table.tableId}] ${rowsResponse?.rows.length} retrieved`));
    tableRows[table.tableId] = rowsResponse.rows;
  }
  return tableRows;
}

/**
 * WiP - Extract all data for a specific participant
 */
export async function exampleTask2() {
  // as we cannot run queries via the api, we must retrive all the data and process locally instead
  const tableRows = await exampleTask1();
  const profileRows = tableRows.profileSummary;
  // when rows are retrieved they are formatted with data stored as 'orderedColumns', representing key-value pairs
  // extract the data using existing script methods
  const profileRowsFormatted = convertODKRowsForExport(profileRows);
  for (const row of profileRowsFormatted) {
    const { f2_guid } = row;
  }
  // process data
}
