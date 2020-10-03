import { Injectable } from "@angular/core";
import OdkDataClass from "./odkData";
import OdkCommonClass from "./odkCommon";
import OdkTablesClass from "./odkTables";
import { HttpClient } from "@angular/common/http";
import {
  IODKQueryResult,
  IODKTableDefQuery,
  IODkTableRowData,
} from "src/app/types/odk.types";
import { NotificationService } from "../notification/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";

// When running on device the following methods are automatically added
// to the window object. When running in development some mocking methods
// are provided in sibling class files (created as needed)
type IODKWindow = Window & {
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
  ready$ = new BehaviorSubject(false);
  lastSync = -1;
  private window: IODKWindow = window as any;
  constructor(
    http: HttpClient,
    private notifications: NotificationService,
    private dialog: MatDialog
  ) {
    // running on device odk will exist in native odk tables window.
    // otherwise we will wait for it to be passed from the iframe component
    if (this.window.odkData && this.window.odkCommon) {
      console.log("running on device");
      this.setServiceReady();
    }
    // Alt implementation of local classes (deprected, but retaining for reference)
    // if (!window.odkData || !window.odkCommon) {
    //   window.odkCommon = new OdkCommonClass();
    //   window.odkData = new OdkDataClass(http);
    //   window.odkTables = new OdkTablesClass(notifications, this.dialog);
    // }
  }
  /**
   * For case where we are relying on iframe to access odk data, ensure the iframe is responding
   * before using the service
   */
  private setServiceReady() {
    this.ready$.next(true);
    this.getLastSync();
  }
  async getLastSync() {
    const meta = await this.arbitrarySqlQueryLocalOnlyTables<IODKTableDefQuery>(
      "_table_definitions",
      "SELECT * from _table_definitions"
    );
    console.log("table meta", meta);
    this.lastSync = meta.map((m) => m._last_sync_time).sort()[0];
  }
  /**
   * Used to pass the window object from the child iframe for use within our services
   */
  setWindow(window: IODKWindow) {
    this.window = window;
    this.setServiceReady();
  }
  handleError(err: Error) {
    this.notifications.handleError(err);
  }

  addRowWithSurvey(tableId: string, formId: string, screenPath?, jsonMap?) {
    return this.window.odkTables.addRowWithSurvey(
      null,
      tableId,
      formId,
      screenPath,
      jsonMap
    );
  }
  editRowWithSurvey(tableId, rowId, formId) {
    return this.window.odkTables.editRowWithSurvey(
      null,
      tableId,
      rowId,
      formId,
      null
    );
  }

  addRow(tableId: string, columnNameValueMap, rowId: string) {
    return new Promise((resolve, reject) => {
      const revision = this.window.odkData._getTableMetadataRevision(tableId);
      console.log("revision", revision);
      const req = this.window.odkData.queueRequest(
        "addRow",
        (res) => resolve(res),
        (err) => {
          this.handleError(err);
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
    failureCallback = this.handleError
  ): Promise<(IODkTableRowData & T)[]> {
    console.log("exec query", tableId, whereClause, sqlBindParams);
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
    failureCallback = this.handleError
  ): Promise<any> {
    console.log("exec query", tableId, sqlCommand, sqlBindParams);
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
    console.log("exec query", tableId, sqlCommand, sqlBindParams);
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
