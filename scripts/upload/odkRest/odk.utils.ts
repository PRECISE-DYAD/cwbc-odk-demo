import { IODKTypes as IODK } from "./odk.types";

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
export function convertODKRowsForExport(
  rows: IODK.IResTableRow[]
): IODK.ITableRow[] {
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
    const metadataColumns1: IODK.ITableMetaColumnKey[] = [
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
    const metadataColumns2: IODK.ITableMetaColumnKey[] = [
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

/********************************************************
 * General Helper functions
 *********************************************************/
/**
 * String convert util
 * @example rowETag -> row_etag
 */
export function camelToSnake(str: string) {
  return str
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + "_" + m[1];
    })
    .toLowerCase();
}

// Simple implementation of UUIDv4
// tslint:disable no-bitwise
export function UUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
