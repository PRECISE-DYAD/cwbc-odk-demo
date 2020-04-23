import { Injectable } from "@angular/core";
import OdkDataClass from "./odkData";
import OdkCommonClass from "./odkCommon";
import OdkTablesClass from "./odkTables";
import { HttpClient } from "@angular/common/http";
import { IODKQueryResult, IODkTableRowData } from "src/app/types/odk.types";
import { NotificationService } from "../notification/notification.service";
import { MatDialog } from "@angular/material/dialog";

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
    if (!window.odkData || !window.odkCommon) {
      window.odkCommon = new OdkCommonClass();
      window.odkData = new OdkDataClass(http);
      window.odkTables = new OdkTablesClass(notifications, this.dialog);
    }
  }
  handleError(err: Error) {
    return this.notifications.handleError(err);
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
    sqlBindParams: string[] = null
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
        (err) => {
          this.handleError(err);
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
