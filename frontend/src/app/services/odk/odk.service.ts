import { Injectable } from "@angular/core";
import OdkDataClass from "./odkData";
import OdkCommonClass from "./odkCommon";
import OdkTablesClass from "./odkTables";
import { HttpClient } from "@angular/common/http";
import { IODKQueryResult } from "src/app/types/odk.types";

// When running on device the following methods are automatically added
// to the window object. When running in development some mocking methods
// are provided in sibling class files (created as needed)
declare const window: Window & {
  odkData: OdkDataClass;
  odkCommon: OdkCommonClass;
  odkTables: any;
};

/**
 * This service provides a wrap around common odk methods and custom odk interactions
 */
@Injectable({
  providedIn: "root"
})
export class OdkService {
  tables: string[];
  constructor(http: HttpClient) {
    // when running on device use native odkData function (injected)
    if (!window.odkData || !window.odkCommon) {
      window.odkCommon = new OdkCommonClass();
      window.odkData = new OdkDataClass(http);
      window.odkTables = new OdkTablesClass();
    }
  }

  addRowWithSurvey(tableId: string, formId: string, screenPath?, jsonMap?) {
    // window.history.replaceState(location.pathname, null, "/");
    return window.odkTables.addRowWithSurvey(
      null,
      tableId,
      formId,
      screenPath,
      jsonMap
    );
  }

  /**
   * Use ODKData Query to return all rows for a specific table
   */
  getTableRows(tableId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      window.odkData.query(
        tableId,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        (res: IODKQueryResult) => {
          const resultsJson = queryResultToJsonArray(res);
          resolve(resultsJson);
        },
        err => {
          handleError(err);
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
function queryResultToJsonArray(res: IODKQueryResult) {
  // query execution returns a queue reference, which needs to be used to retrieve data
  const { metadata, data } = res.resultObj;
  const cols = {};
  for (const [key, value] of Object.entries(metadata.elementKeyMap)) {
    cols[value as any] = key;
  }
  // data contains array of row values, convert to json with column keys
  const mapped = data.map(row => {
    const json = {};
    row.forEach((val, i) => (json[cols[i]] = val));
    return json;
  });
  return mapped;
}

function handleError(err) {
  console.error(err);
}
