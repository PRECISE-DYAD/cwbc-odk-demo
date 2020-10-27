import { Injectable } from "@angular/core";
import OdkDataClass from "./altMockImplementation/odkData";
import OdkCommonClass from "./altMockImplementation/odkCommon";
import OdkTablesClass from "./altMockImplementation/odkTables";
import {
  IODKQueryResult,
  IODKTableDefQuery,
  IODkTableRowData,
} from "src/app/types/odk.types";
import { NotificationService } from "../notification/notification.service";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

// When running on device the following methods are automatically added
// to the window object. When running in development some mocking methods
// are provided in sibling class files (created as needed)
type IODKWindow = Window & {
  odkData: OdkDataClass;
  odkCommon: OdkCommonClass;
  odkTables: OdkTablesClass;
};

/**
 * When developing locally some of the required metadata for launching forms isn't available
 * as not triggering click events in designer. Track metadata used when launching forms instead
 */
interface IActiveArgs {
  tableId?: string;
  formId?: string;
  screenPath?: string;
  jsonMap?: string;
  rowId?: string;
  columnNameValueMap?: string;
}

/**
 * This service provides a wrap around common odk methods and custom odk interactions
 */
@Injectable({
  providedIn: "root",
})
export class OdkService {
  tables: string[];
  ready$ = new BehaviorSubject(false);
  surveyIsOpen$ = new BehaviorSubject(false);
  activeArgs: IActiveArgs = {};
  private window: IODKWindow = window as any;
  constructor(private notifications: NotificationService) {
    // running on device odk will exist in native odk tables window.
    // otherwise we will wait for it to be passed from the iframe component
    if (environment.production) {
      this.setServiceReady();
    }
  }
  /**
   * For case where we are relying on iframe to access odk data, ensure the iframe is responding
   * before using the service
   */
  private setServiceReady() {
    this.ready$.next(true);
  }
  /**
   * Run a query on _table_definitions table to retrieve basic metadata
   */
  async getTableMeta() {
    const meta = await this.arbitrarySqlQueryLocalOnlyTables<IODKTableDefQuery>(
      "_table_definitions",
      "SELECT * from _table_definitions"
    );
    return meta;
  }
  /**
   * WiP - Retrieve the last time the device was sync'd with the server
   * Note - current implementation seems missing (last_sync_time always -1)
   */
  async getLastSync() {
    const meta = await this.getTableMeta();
    const lastSync = meta.map((m) => m._last_sync_time).sort()[0];
    return lastSync;
  }

  async getRecordsToSync() {
    const meta = await this.getTableMeta();
    const tableIds = meta.map((m) => m._table_id);
    let totalToSync = 0;
    for (const tableId of tableIds) {
      const records = await this.query(tableId, "_sync_state != ?", ["synced"]);
      totalToSync += records.length;
    }
    console.log("total to sync", totalToSync);
    return totalToSync;
  }

  /**
   * Used to pass the window object from the child iframe for use within our services
   */
  setWindow(window: IODKWindow) {
    this.window = window;
    this.setServiceReady();
  }
  handleError(err: Error, additionalText: string = "") {
    console.error(err);
    this.notifications.handleError(err, additionalText);
  }

  /**********************************************************************************************
   *  Default Methods
   *********************************************************************************************/

  /**
   * Take the path of a file relative to the app folder and return a url by
   * which it can be accessed.
   * @param relativePath the path of a file relative to the app folder, e.g. `config/assets/csv/tables.init`
   * @return an absolute URI to the file
   */

  getFileAsUrl(relativePath: string) {
    return this.window.odkCommon.getFileAsUrl(relativePath);
  }

  addRowWithSurvey(tableId: string, formId: string, screenPath?, jsonMap?) {
    this.activeArgs = { tableId, formId, screenPath, jsonMap };
    this.surveyIsOpen$.next(true);
    return this.window.odkTables.addRowWithSurvey(
      null,
      tableId,
      formId,
      screenPath,
      jsonMap
    );
  }
  editRowWithSurvey(tableId, rowId, formId) {
    this.activeArgs = { tableId, formId, rowId };
    this.surveyIsOpen$.next(true);
    return this.window.odkTables.editRowWithSurvey(
      null,
      tableId,
      rowId,
      formId,
      null
    );
  }

  addRow(tableId: string, columnNameValueMap, rowId: string) {
    this.activeArgs = { tableId, columnNameValueMap, rowId };
    this.surveyIsOpen$.next(true);
    return new Promise((resolve, reject) => {
      const revision = this.window.odkData._getTableMetadataRevision(tableId);
      console.log("revision", revision);
      const req = this.window.odkData.queueRequest(
        "addRow",
        (res) => resolve(res),
        (err) => {
          this.handleError(err, `add row - tableId: ${tableId}`);
          reject(err);
        }
      );
      this.window.odkData
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
   * Delete a row from the database
   * @param rowId - `_id` property of row
   */
  deleteRow(tableId: string, rowId: string) {
    return new Promise((resolve, reject) => {
      this.window.odkData.deleteRow(
        tableId,
        null,
        rowId,
        (res) => resolve(res),
        (err) => {
          this.handleError(err, `delete row - tableId: ${tableId}`);
          reject(err);
        }
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
   * Execute query to retrieve rows from a data table
   * @param whereClause - sql logical comparison
   * @param sqlBindParams - variables to replace in whereclause
   * @example query('someTable','_id = ?',[123])
   */
  query<T>(
    tableId: string,
    whereClause: string = null,
    sqlBindParams: string[] = null,
    failureCallback = (err) => {
      this.handleError(err, `query: ${tableId} ${whereClause || ""}`);
    }
  ): Promise<(IODkTableRowData & T)[]> {
    return new Promise((resolve, reject) => {
      this.window.odkData.query(
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
      this.window.odkData.arbitraryQuery(
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

  /**
   * Execute a query on ANY tables (odk or local)
   * @param sqlCommand - Full SQL command (as can be operated on any table), e.g.
   * ```
   * SELECT * from _table_definitions
   * ```
   * @param sqlBindParams - array of values to replace '?' in sql statements
   */
  arbitrarySqlQueryLocalOnlyTables<T>(
    tableId: string,
    sqlCommand: string,
    sqlBindParams: string[] = [],
    failureCallback = this.handleError
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.window.odkData.arbitrarySqlQueryLocalOnlyTables(
        tableId,
        sqlCommand,
        sqlBindParams,
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
}

/********************************************************************************************
 * Helper Functions
 *********************************************************************************************/

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
