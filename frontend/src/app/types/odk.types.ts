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
        _locale: 7
      },
      lastSyncTime: "-1",
      offset: -1,
      limit: -1,
      tableId: "exampleTable",
      schemaETag: null,
      lastDataETag: null,
      canCreateRow: true
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
        "rwd"
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
        "rwd"
      ]
    ],
    callbackJSON: "0"
  }
};
