import { Injectable } from "@angular/core";
import OdkDataClass from "./odkData";
import OdkCommonClass from "./odkCommon";
import OdkTablesClass from "./odkTables";
import { HttpClient } from "@angular/common/http";
import { IODKQueryResult, IODkTableRowData } from "src/app/types/odk.types";
import { NotificationService } from "../notification/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from "rxjs";

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
    console.log("service is ready", this.window.odkData);
  }
  /**
   * Used to pass the window object from the child iframe for use within our services
   */
  setWindow(window: IODKWindow) {
    console.log("setting window", window);
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
