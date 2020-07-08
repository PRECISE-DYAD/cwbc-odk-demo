import {
  ITableMeta,
  IUserPriviledge,
  ITableRow,
  ITableSchema,
  AccessLevel,
  BoolString,
  ISOString,
  Savepoint,
  ITableMetaColumnKey,
  IManifestItem,
} from "./odk.types";
import http from "../http";

/**
 * Common methods for interacting with ODK rest
 * NOTE - Mostly copied from odkxm project
 */
export class OdkRestService {
  constructor(private appId = "default") {}

  /********************************************************
   * Implementation of specific ODK Rest Functions
   * https://docs.odk-x.org/odk-2-sync-protocol/
   * TODO - remove all local state management to better reflect odk-x sync
   *********************************************************/
  async getPriviledgesInfo(appId = "default") {
    const path = `${appId}/privilegesInfo`;
    return http.get<IResUserPriviledge>(path);
  }
  async getTables(appId = "default") {
    const path = `${appId}/tables`;
    return http.get<IResTables>(path);
  }
  async getDefinition(tableId: string, schemaETag: string, appId = "default") {
    const path = `${appId}/tables/${tableId}/ref/${schemaETag}`;
    return http.get<IResSchema>(path);
  }
  async getRows(tableId: string, schemaETag: string, appId = "default") {
    const path = `${appId}/tables/${tableId}/ref/${schemaETag}/rows`;
    return http.get<IResTableRows>(path);
  }

  async createTable(schema: ITableSchema, appId = "default") {
    const { tableId } = schema;
    const path = `${appId}/tables/${tableId}`;
    return http.put<IResTableCreate>(path, schema);
  }

  alterRows(
    tableId: string,
    schemaETag: string,
    rows: RowList,
    appId = "default"
  ) {
    const path = `${appId}/tables/${tableId}/ref/${schemaETag}/rows`;
    return http.put(path, rows);
  }

  deleteTable(tableId: string, schemaETag: string, appId = "default") {
    const path = `${appId}/tables/${tableId}/ref/${schemaETag}`;
    return http.del(path);
  }

  getAppLevelFileManifest(odkClientVersion = 2) {
    const path = `default/manifest/${odkClientVersion}`;
    return http.get<{ files: IManifestItem[] }>(path);
  }

  getTableIdFileManifest(tableId: string, odkClientVersion = 2) {
    const path = `default/manifest/${odkClientVersion}/${tableId}`;
    return http.get<{ files: IManifestItem[] }>(path);
  }

  /********************************************************
   * ODK Helper functions
   *********************************************************/

  /**
   * By default ODK rest returns rows with metadata and values defined in
   * a different format to how it is shown and exported in app
   * - Convert metadata fields to snake_case and prefix with underscore,
   * - De-nest filterScope and add to metadata prefixed with _group
   * - De-nest orderedColumns and extract to variable values
   * - Delete various fields
   * - Match metafield order as specified in SyncClient.java
   */
  private _convertODKRowsForExport(rows: IResTableRow[]): ITableRow[] {
    const converted = [];
    rows.forEach((row) => {
      const data: any = {};
      // create mapping for all fields as snake case, and un-nest filtersocpe fields
      const { filterScope } = row;
      Object.entries(filterScope).forEach(([key, value]) => {
        row[`_${this._camelToSnake(key)}`] = value;
      });
      Object.entries(row).forEach(([key, value]) => {
        row[`_${this._camelToSnake(key)}`] = value;
      });
      const metadataColumns1: ITableMetaColumnKey[] = [
        "_id",
        "_form_id",
        "_locale",
        "_savepoint_type",
        "_savepoint_timestamp",
        "_savepoint_creator",
        "_deleted",
        "_data_etag_at_modification",
      ];
      // some metadata columns go to front
      metadataColumns1.forEach((col) => (data[col] = row[col]));
      // main data in centre
      row.orderedColumns.forEach((el) => {
        const { column, value } = el;
        data[column] = value;
      });
      const metadataColumns2: ITableMetaColumnKey[] = [
        "_default_access",
        "_group_modify",
        "_group_privileged",
        "_group_read_only",
        "_row_etag",
        "_row_owner",
      ];
      // other metadata columns go to back
      metadataColumns2.forEach((col) => (data[col] = row[col]));
      converted.push(data);
    });
    console.log("converted", converted);
    return converted;
  }
  /**
   * String convert util
   * @example rowETag -> row_etag
   */
  private _camelToSnake(str: string) {
    return str
      .replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + "_" + m[1];
      })
      .toLowerCase();
  }
}

/********************************************************
 * General Helper functions
 *********************************************************/

// Simple implementation of UUIDv4
// tslint:disable no-bitwise
function UUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/********************************************************
 * Service-specific interfaces
 *********************************************************/
interface IResTables extends IResBase {
  appLevelManifestETag: string;
  tables: ITableMeta[];
}
interface IResTableRows extends IResBase {
  dataETag: string;
  rows: IResTableRow[];
  tableUri: string;
}
interface IResTableRow {
  createUser: string;
  dataETagAtModification: string;
  deleted: false;
  filterScope: {
    defaultAccess: AccessLevel;
    rowOwner: string;
    groupReadOnly: BoolString;
    groupModify: BoolString;
    groupPrivileged: BoolString;
  };
  formId: string;
  id: string;
  lastUpdateUser: string;
  locale: string;
  orderedColumns: IResTableColumn[];
  rowETag: string;
  savepointCreator: string;
  savepointTimestamp: ISOString;
  savepointType: Savepoint;
  selfUri: string;
}
interface IResTableColumn {
  column: string;
  value: any;
}
interface IResAlterRows {
  dataETag: string;
  rows: ITableRowAltered[];
  tableUri: string;
}
interface ITableRowAltered extends ITableRow {
  outcome: "UNKNOWN" | "SUCCESS" | "DENIED" | "IN_CONFLICT" | "FAILED";
}
interface IResTableCreate {
  tableId: string;
  dataETag: string;
  schemaETag: string;
  selfUri: string;
  definitionUri: string;
  dataUri: string;
  instanceFilesUri: string;
  diffUri: string;
  aclUri: string;
  tableLevelManifestETag: null;
}
interface IResBase {
  hasMoreResults: boolean;
  hasPriorResults: boolean;
  webSafeBackwardCursor: string;
  webSafeRefetchCursor: null;
  webSafeResumeCursor: string;
}
interface IResSchema extends ITableSchema {
  selfUri: string;
  tableUri: string;
}

type IResUserPriviledge = IUserPriviledge;
interface RowList {
  // rows not technically partial, but same without selfUri info
  rows: Partial<IResTableRow>[];
  dataETag: string;
}
