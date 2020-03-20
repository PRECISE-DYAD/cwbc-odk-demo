import { HttpClient } from "@angular/common/http";
import { IODKQueryResult } from "src/app/types/odk.types";

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
    console.log("data query mock");
    // retrieve csv, convert text to data array and reformat to match expected
    // response format
    this.http
      .get(`../assets/odk/csv/${tableId}.csv`, { responseType: "text" })
      .toPromise()
      .then(csvText => {
        let rows = csvText.split("\n").map(el => el.split(","));
        const headers = rows.splice(0, 1)[0];
        // remove empty rows
        console.log(rows, headers.length);
        rows = rows.filter(r => r.length === headers.length);
        const elementKeyMap = {};
        headers.forEach((v, i) => (elementKeyMap[v] = i));
        const res: IODKQueryResult = {
          resultObj: {
            data: rows,
            metadata: { elementKeyMap }
          }
        };
        successCallbackFn(res);
      })
      .catch(err => failureCallbackFn(err));
  }
}
export default OdkDataClass;
