import * as sqlite from "better-sqlite3";
import * as chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";

const SQLITE_PATH = path.join(__dirname, "./sqlite.db");
const db = sqlite(SQLITE_PATH, {
  fileMustExist: true,
  // verbose: console.log,
  readonly: false,
});

/**
 * SQLite has the ability to store data of multiple types in the same column.
 * This can lead to errors when syncing with other database which are more rigidly typed, such as postgres.
 * This script checks all tables and columns for occurences of multiple datatypes in a column
 */
function main() {
  if (fs.existsSync(SQLITE_PATH)) {
    console.log("checking data");
    const tableIds = listTableIds();
    for (const tableId of tableIds) {
      const inconsistencies = checkColumnDataConsistency(tableId);
      if (inconsistencies.length > 0) {
        console.log(chalk.red("❌", tableId));
        console.table(inconsistencies);
      } else {
        console.log(chalk.green("✅", tableId));
      }
    }
  } else {
    console.error(chalk.red("SQLITE File not found", SQLITE_PATH));
  }
}
main();

function listTableIds() {
  const sql = `SELECT name FROM sqlite_master WHERE type = 'table';`;
  const stmt = db.prepare(sql);
  const tables: { name: string }[] = stmt.all();
  return tables.filter((t) => !t.name.startsWith("_")).map((t) => t.name);
}

function checkColumnDataConsistency(tableId: string) {
  const colInfo = db.pragma(`table_info(${tableId})`);
  const info: {
    cid: number;
    name: string;
    expected: string;
    diffTypes: number;
    types: string[];
  }[] = [];
  for (const col of colInfo) {
    const { cid, name, type } = col;
    // get a list of all the non-null column types in the data
    const sql = `SELECT DISTINCT typeof(${name}) as type from ${tableId} WHERE ${name} IS NOT NULL`;
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    const types = rows.map((r) => r.type);
    info.push({ cid, name, expected: type, diffTypes: rows.length, types });
  }
  const inconsistent = info.filter(
    (i) => i.diffTypes > 1 || (i.types.length > 0 && !i.types.includes(i.expected.toLowerCase()))
  );
  return inconsistent;
}
