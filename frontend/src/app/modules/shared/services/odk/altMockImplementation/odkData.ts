import { HttpClient } from "@angular/common/http";
import { IODKQueryResult } from "src/app/modules/shared/types/odk.types";
import Papa from "papaparse";

// tslint:disable variable-name

abstract class OdkDataClass {
  _requestMap: any[] = [];
  _transactionId: 0;
  _callbackId: 0;
  _tableMetadataCache: {};
  constructor(private http: HttpClient) {}
  abstract deleteRow(
    tableId: string,
    columnNameValueMap: any,
    rowId: string,
    successCallbackFn: (res) => void,
    failureCallbackFn: (err) => void
  ): void;

  getAllTableIds(successCallbackFn, failureCallbackFn) {
    console.error("getAllTableIds not implemented");
    return [];
  }
  _getTableMetadataRevision(tableId: string) {
    console.error("_getTableMetadataRevision not implemented");
    return null;
  }
  getOdkDataIf() {
    console.error("getOdkDataIf not implemented");
    return {} as any;
  }
  queueRequest(requestType: string, successCallbackFn, failureCallbackFn) {
    console.error("queueRequest not implemented");
    return { _callbackId: null };
  }
  getResponseJSON() {
    console.error("queueRequest not implemented");
  }
  arbitrarySqlQueryLocalOnlyTables(...args) {
    console.error("not implemented");
  }
  getRows(tableId, rowId, successCallbackFn, failureCallbackFn) {
    console.log("getting rows");
  }
  arbitraryQuery(...args) {
    console.error("arbitraryQuery not implemented");
    return [];
  }
  /**
   * For mock implementation return any data as defined in the `forms/csv`
   * folder for the corresponding table (no sort/filter logic applied)
   */
  query(
    tableId: string,
    whereClause,
    sqlBindParams,
    groupBy,
    having,
    orderByElementKey,
    orderByDirection,
    limit,
    offset,
    includeKVS,
    successCallbackFn,
    failureCallbackFn
  ) {
    // retrieve csv, convert text to data array and reformat to match expected
    // response format
    this.http
      .get(`../assets/odk/csv/${tableId}.csv`, { responseType: "text" })
      .toPromise()
      .then((csvText) => {
        csvToODKQueryResult(csvText);
      })
      .catch((err) => {
        if (err.status === 404) {
          // no csv preloaded, just return empty
          // TODO - check with tables.init to see if should be available
          csvToODKQueryResult("");
        } else {
          failureCallbackFn(err);
        }
      });

    /**
     * CSV text must be parsed to get the underlying data format,
     * and return in the same way that ODK does
     */
    function csvToODKQueryResult(csvText: string) {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        error: (err) => {
          failureCallbackFn(err);
        },
        complete: (r) => {
          // TODO - make general where clause
          if (whereClause && sqlBindParams) {
            r.data = _executeSQLFilter(r.data, whereClause, sqlBindParams);
          }
          const headers = r.meta.fields;
          let rows = r.data.map((el) => Object.values(el)) as string[][];
          const elementKeyMap = {};
          headers.forEach((v, i) => {
            elementKeyMap[v] = i;
          });
          const res: IODKQueryResult = {
            resultObj: {
              data: rows,
              metadata: { elementKeyMap },
            },
          };
          successCallbackFn(res);
        },
      });
    }
  }
}
export default OdkDataClass;

/**
 * Rough implementation of an sql query, purely to support
 * a single where equal filter clause
 * TODO - improve to make more general
 * @param data
 * @param whereClause
 * @param sqlBindParams
 */
function _executeSQLFilter(
  data: any[],
  whereClause: string,
  sqlBindParams: string[]
) {
  const split = whereClause.split(" ");
  const field = split[0];
  const operator = split[1];
  const value = split[2].replace("?", sqlBindParams[0]);
  switch (operator) {
    case "=":
      return data.filter((v) => v[field] === value);
    default:
      alert("query not available in web version");
  }
}
