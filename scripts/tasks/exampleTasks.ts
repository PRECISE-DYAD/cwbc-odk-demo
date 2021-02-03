import * as chalk from "chalk";
import { OdkRestService } from "../odkRest/odk.rest";
import { setEnv } from "../utils";

const odkRest = new OdkRestService();

/**
 * This task retrieves a list of
 * This task can be run via `npm run tasks exampleTask`
 */
export async function exampleTask1() {
  // if not already set, this script will populate environment variables
  // such as the ODK_SERVER_URL, USERNAME and PASSWORD
  await setEnv();
  // get a list of all tables
  const tablesResponse = await odkRest.getTables();
  const tables = tablesResponse.tables;
  console.log(tables.length, "tables retrieved... Fetching rows");
  // for each table
  for (let table of tables) {
    const rowsResponse = await odkRest.getRows(table.tableId, table.schemaETag);
    console.log(chalk.yellow(`[${table.tableId}] has ${rowsResponse.rows.length} rows`));
  }
}

export async function exampleTask2() {}
