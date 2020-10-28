import { Injectable } from "@angular/core";
import OdkDataClass from "./odkData";
import OdkCommonClass from "./odkCommon";
import OdkTablesClass from "./odkTables";
import { HttpClient } from "@angular/common/http";
import { IODKQueryResult, IODkTableRowData } from "src/app/types/odk.types";
import { NotificationService } from "../notification/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "src/environments/environment";

// When running on device the following methods are automatically added
// to the window object. When running in development some mocking methods
// are provided in sibling class files (created as needed)
declare const window: Window & {
  odkData: OdkDataClass;
  odkCommon: OdkCommonClass;
  odkTables: OdkTablesClass;
};

/**
 * This service provides a wrap around common odk methods and custom odk interactions
 */
@Injectable({
  providedIn: "root",
})
export class OdkService {
  tables: string[];
  constructor(
    http: HttpClient,
    private notifications: NotificationService,
    private dialog: MatDialog
  ) {
    // when running on device use native odkData function (injected)
    if (!environment.production) {
      console.log("using development odk classes");
      window.odkCommon = new OdkCommonClass();
      window.odkData = new OdkDataClass(http);
      window.odkTables = new OdkTablesClass(notifications, this.dialog);
    }
  }
  /**
   * Manually update a row in the database
   * Performs a lookup for the rowID, and if exists first checks values, and then updates if different
   * @param jsonMap key:value pairs to update in the row
   */
  async updateRow(tableId: string, rowId: string, jsonMap: any = {}) {
    const existingData = await this.query(tableId, "_id = ?", [rowId]);
    // There should be exactly 1 row matched by the query, However for now allow more than 1
    // (local web sql sometimes creates temporary duplicates). Possibly should reconsider in future
    if (existingData[0]) {
      const row = existingData[0];
      const updates: { key: string; newValue: string; oldValue: string }[] = [];
      Object.entries<any>(jsonMap).forEach(async ([key, newValue]) => {
        if (!row.hasOwnProperty(key)) {
          return this.handleError(
            `Cannot update [${key}] on table [${tableId}] - column does not exist`
          );
        } else if (row[key] !== newValue) {
          updates.push({ key, newValue, oldValue: row[key] });
        }
      });
      if (updates.length > 0) {
        const colKeys = updates.map((u) => `${u.key} = ?`).join(" ,");
        const colVals = updates.map((u) => u.newValue);
        const sql = `UPDATE ${tableId} SET ${colKeys} WHERE _id = ?;`;
        colVals.push(rowId);
        console.log("sql", sql, colVals);
        await this.arbitraryQuery(tableId, sql, colVals);
      } else {
        console.log("piped data up-to-date");
      }
    } else {
      console.log("Error: expected 1 Record to update, found", existingData);
      this.handleError(`failed to update row: ${tableId} :${rowId}`);
    }
  }

  /**
   * Used to pass the window object from the child iframe for use within our services
   * TODO - merge with cc-updates-2 code
   */
  // setWindow(window: IODKWindow) {
  //   this.window = window;
  //   this.setServiceReady();
  // }
  handleError(err: Error | string, additionalText: string = "") {
    console.error(err);
    this.notifications.handleError(err, additionalText);
  }

  addRowWithSurvey(tableId: string, formId: string, screenPath?, jsonMap?) {
    return window.odkTables.addRowWithSurvey(
      null,
      tableId,
      formId,
      screenPath,
      jsonMap
    );
  }
  /**
   * Launch ODK survey with a row for editing
   * @see NOTE -this does not accept piped data. If wanting to pipe data this must
   * be written to the table before opening (e.g. via precise store launch edit method)
   */
  editRowWithSurvey(tableId, rowId, formId) {
    return window.odkTables.editRowWithSurvey(
      null,
      tableId,
      rowId,
      formId,
      null
    );
  }

  addRow(tableId: string, columnNameValueMap, rowId: string) {
    return new Promise((resolve, reject) => {
      const revision = window.odkData._getTableMetadataRevision(tableId);
      console.log("revision", revision);
      const req = window.odkData.queueRequest(
        "addRow",
        (res) => resolve(res),
        (err) => {
          this.handleError(err);
          reject(err);
        }
      );
      window.odkData
        .getOdkDataIf()
        .addRow(
          tableId,
          JSON.stringify(columnNameValueMap),
          rowId,
          revision,
          req._callbackId
        );
    });
  }

  /**
   * Use ODKData Query to return all rows for a specific table
   */
  getTableRows<T>(tableId: string): Promise<(IODkTableRowData & T)[]> {
    return this.query(tableId);
  }

  /**
   * Execute direct queries on database
   * @param whereClause - sql logical comparison
   * @param sqlBindParams - variables to replace in whereclause
   * @example query('someTable','_id = ?',[123])
   */
  query<T>(
    tableId: string,
    whereClause: string = null,
    sqlBindParams: string[] = null,
    failureCallback = this.handleError
  ): Promise<(IODkTableRowData & T)[]> {
    return new Promise((resolve, reject) => {
      window.odkData.query(
        tableId,
        whereClause,
        sqlBindParams,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        (res: IODKQueryResult) => {
          const resultsJson = queryResultToJsonArray<T>(res);
          resolve(resultsJson);
        },
        (err: Error) => {
          failureCallback(err);
          reject(err);
        }
      );
    });
  }
  /**
   * Execute generic query on a table (not just to specifically retrieve rows)
   * NOTE - to execute on a non-odk table (e.g. _table_definitions) better to use local arbitrary query
   * @param tableId - Must be a valid odk data table as metadata for the table returned in response.
   * If querying non-odk table pass valid table and use non-odk table in sqlCommand
   * @param sqlCommand - Full SQL command (as can be operated on any table), e.g.
   * ```
   * SELECT * from _table_definitions
   * ```
   * @param sqlBindParams - array of values to replace '?' in sql statements
   */
  arbitraryQuery<T>(
    tableId: string,
    sqlCommand: string,
    sqlBindParams: string[] = [],
    failureCallback = (err) =>
      this.handleError(err, `query tableId: ${tableId}`)
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      window.odkData.arbitraryQuery(
        tableId,
        sqlCommand,
        sqlBindParams,
        null,
        null,
        (res: IODKQueryResult) => {
          resolve(res);
        },
        (err: Error) => {
          failureCallback(err);
          reject(err);
        }
      );
    });
  }
}

/**
 * When ODK query results are received row data is separate from corresponding row headings.
 * This function merges into a single JSON object array
 * @param res - result object passed from ODK
 */
function queryResultToJsonArray<T>(
  res: IODKQueryResult
): (IODkTableRowData & T)[] {
  // query execution returns a queue reference, which needs to be used to retrieve data
  const { metadata, data } = res.resultObj;
  const cols = {};
  for (const [key, value] of Object.entries(metadata.elementKeyMap)) {
    cols[value as any] = key;
  }
  // data contains array of row values, convert to json with column keys
  const mapped = data.map((row) => {
    const json = {};
    row.forEach((val, i) => (json[cols[i]] = val));
    return json as IODkTableRowData & T;
  });
  return mapped;
}
