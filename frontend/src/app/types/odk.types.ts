export interface IODKQueryResult {
  resultObj: {
    metadata: {
      elementKeyMap: {
        // represents where in the array a specific field is, e.g. _id : 1
        [columnName: string]: number;
      };
      lastSyncTime?: string;
      offset?: number;
      limit?: number;
      tableId?: string;
      schemaETag?: any;
      lastDataETag?: any;
      canCreateRow?: boolean;
    };
    data: string[][];
    // string representation of number in callback queue
    // e.g. "2" means was second query to resolve
    callbackJSON?: string;
  };
}
// ODK table data combines metadata with survey field values
export interface IODkTableRowData extends IODKTableRowMetaData {
  [field: string]: any;
}
interface IODKTableRowMetaData {
  _default_access: string;
  _form_id: string;
  _id: string;
  _locale: string;
  _row_owner: string;
  _savepoint_creator: string;
  _savepoint_timestamp: string;
  _savepoint_type: string;
  _sync_state: string;
  _effective_access: string;
  _group_modify?: string;
  _group_privileged?: string;
  _group_read_only?: string;
  _row_etag?: string;
  _conflict_type?: string;
}

export const ODK_META_EXAMPLE: IODKTableRowMetaData = {
  _default_access: "FULL",
  _form_id: "profileSummary",
  _id: "uuid:d7d3c67a-2672-4b9c-a4a7-a8a26a4c3d42",
  _locale: "en_GB",
  _row_owner: "anonymous",
  _savepoint_creator: "anonymous",
  _savepoint_timestamp: "2020-04-07T20:46:14.902000000",
  _savepoint_type: "COMPLETE",
  _sync_state: "new_row",
  _effective_access: "rwd",
  // only from data export
  _group_modify: "TRUE",
  _group_privileged: "(...)",
  _group_read_only: "TRUE",
  _row_etag: "",
  _conflict_type: null,
};

/************************************************************************
 *  Examples
 ***********************************************************************/
const MOCK_ODK_QUERY_RESULT: IODKQueryResult = {
  resultObj: {
    metadata: {
      elementKeyMap: {
        _row_etag: 8,
        _effective_access: 15,
        _conflict_type: 0,
        _group_privileged: 4,
        _sync_state: 13,
        _group_read_only: 5,
        _savepoint_type: 12,
        _savepoint_creator: 10,
        _savepoint_timestamp: 11,
        _group_modify: 3,
        name: 14,
        _form_id: 2,
        _id: 6,
        _row_owner: 9,
        _default_access: 1,
        _locale: 7,
      },
      lastSyncTime: "-1",
      offset: -1,
      limit: -1,
      tableId: "exampleTable",
      schemaETag: null,
      lastDataETag: null,
      canCreateRow: true,
    },
    data: [
      [
        null,
        "FULL",
        "exampleTable",
        null,
        null,
        null,
        "uuid:810cbb50-e330-4d51-8766-3a3ce7b46d33",
        "en_GB",
        null,
        "anonymous",
        "anonymous",
        "2020-03-19T17:09:37.716000000",
        "COMPLETE",
        "new_row",
        "Chris Clarke",
        "rwd",
      ],
      [
        null,
        "FULL",
        "exampleTable",
        null,
        null,
        null,
        "uuid:810cbb50-e330-4d51-8766-3a3ce7b46d34",
        "en_GB",
        null,
        "anonymous",
        "anonymous",
        "2020-03-19T17:09:38.716000000",
        "COMPLETE",
        "new_row",
        "Someone Else",
        "rwd",
      ],
    ],
    callbackJSON: "0",
  },
};
const MOCK_ODK_TABLE_ROW_METADATA = {
  _id: "uuid:810cbb50-e330-4d51-8766-3a3ce7b46d34",
  _form_id: "exampleTable",
  _locale: "en_GB",
  _savepoint_type: "COMPLETE",
  _savepoint_timestamp: "2020-03-19T17:09:38.716000000",
  _savepoint_creator: "anonymous",
  _default_access: "FULL",
  _group_modify: "",
  _group_privileged: "",
  _group_read_only: "",
  _row_etag: "",
  "_row_owner ": "anonymous",
};
