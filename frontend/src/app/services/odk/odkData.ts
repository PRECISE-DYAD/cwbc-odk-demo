import { HttpClient } from "@angular/common/http";
import { IODKQueryResult } from "src/app/types/odk.types";
import Papa from "papaparse";

// tslint:disable variable-name

class OdkDataClass {
  _requestMap: any[] = [];
  _transactionId: 0;
  _callbackId: 0;
  _tableMetadataCache: {};
  constructor(private http: HttpClient) {}
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
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          error: (err) => failureCallbackFn(err),
          complete: (r) => {
            // const headers = r.data.splice(0, 1)[0];
            const headers = r.meta.fields;
            const rows = r.data.map((el) => Object.values(el)) as string[][];
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
      })
      .catch((err) => failureCallbackFn(err));
  }
}
export default OdkDataClass;
