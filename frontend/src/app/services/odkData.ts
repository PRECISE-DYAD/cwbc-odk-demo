interface IResponse {
  resultObj: {
    metadata: {
      tableIds: string[];
    };
  };
}

export class OdkDataClass {
  getAllTableIds(successCallbackFn, failureCallbackFn): IResponse {
    console.log("getting all table ids");
    return {} as IResponse;
  }

  /********************************************************************************
   * Not yet mapped
   ************************************************************************/

  // _getTableMetadata: function(tableId) {
  //   if (tableId === null || tableId === undefined) {
  //     return null;
  //   }
  //   var tableEntry = this._tableMetadataCache[tableId];
  //   if (tableEntry === undefined || tableEntry === null) {
  //     return null;
  //   }
  //   return tableEntry;
  // },
  // _getTableMetadataRevision: function(tableId) {
  //   if (tableId === null || tableId === undefined) {
  //     return null;
  //   }
  //   var tableEntry = this._tableMetadataCache[tableId];
  //   if (tableEntry === undefined || tableEntry === null) {
  //     return null;
  //   }
  //   return tableEntry.metaDataRev;
  // },
  // _putTableMetadata: function(tableId, metadata) {
  //   if (tableId === null || tableId === undefined) {
  //     return;
  //   }
  //   this._tableMetadataCache[tableId] = metadata;
  // },
  // getOdkDataIf: function() {
  //   return window.odkDataIf;
  // },
  // getViewData: function(successCallbackFn, failureCallbackFn, limit, offset) {
  //   var req = this.queueRequest(
  //     "getViewData",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   limit = limit !== undefined ? limit : null;
  //   offset = offset !== undefined ? offset : null;
  //   this.getOdkDataIf().getViewData(req._callbackId, limit, offset);
  // },
  // getRoles: function(successCallbackFn, failureCallbackFn) {
  //   var req = this.queueRequest(
  //     "getRoles",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().getRoles(req._callbackId);
  // },
  // getDefaultGroup: function(successCallbackFn, failureCallbackFn) {
  //   var req = this.queueRequest(
  //     "getDefaultGroup",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().getDefaultGroup(req._callbackId);
  // },
  // getUsers: function(successCallbackFn, failureCallbackFn) {
  //   var req = this.queueRequest(
  //     "getUsers",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().getUsers(req._callbackId);
  // },

  // query: function(
  //   tableId,
  //   whereClause,
  //   sqlBindParams,
  //   groupBy,
  //   having,
  //   orderByElementKey,
  //   orderByDirection,
  //   limit,
  //   offset,
  //   includeKVS,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest("query", successCallbackFn, failureCallbackFn);
  //   var stringLimit = limit == null ? null : limit.toString();
  //   var stringOffset = offset == null ? null : offset.toString();
  //   // need to JSON.stringify bind parameters so we can pass integer, numeric and boolean parameters as-is.
  //   var sqlBindParamsJSON =
  //     sqlBindParams === null || sqlBindParams === undefined
  //       ? null
  //       : JSON.stringify(sqlBindParams);
  //   this.getOdkDataIf().query(
  //     tableId,
  //     whereClause,
  //     sqlBindParamsJSON,
  //     groupBy,
  //     having,
  //     orderByElementKey,
  //     orderByDirection,
  //     stringLimit,
  //     stringOffset,
  //     includeKVS,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // arbitraryQuery: function(
  //   tableId,
  //   sqlCommand,
  //   sqlBindParams,
  //   limit,
  //   offset,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "arbitraryQuery",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   var stringLimit = limit == null ? null : limit.toString();
  //   var stringOffset = offset == null ? null : offset.toString();
  //   // need to JSON.stringify bind parameters so we can pass integer, numeric and boolean parameters as-is.
  //   var sqlBindParamsJSON =
  //     sqlBindParams === null || sqlBindParams === undefined
  //       ? null
  //       : JSON.stringify(sqlBindParams);
  //   this.getOdkDataIf().arbitraryQuery(
  //     tableId,
  //     sqlCommand,
  //     sqlBindParamsJSON,
  //     stringLimit,
  //     stringOffset,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // getRows: function(tableId, rowId, successCallbackFn, failureCallbackFn) {
  //   var req = this.queueRequest(
  //     "getRows",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().getRows(
  //     tableId,
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // getMostRecentRow: function(
  //   tableId,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "getMostRecentRow",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().getMostRecentRow(
  //     tableId,
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // changeAccessFilterOfRow: function(
  //   tableId,
  //   defaultAccess,
  //   rowOwner,
  //   groupReadOnly,
  //   groupModify,
  //   groupPrivileged,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "changeAccessFilterOfRow",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().changeAccessFilterOfRow(
  //     tableId,
  //     defaultAccess,
  //     rowOwner,
  //     groupReadOnly,
  //     groupModify,
  //     groupPrivileged,
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // updateRow: function(
  //   tableId,
  //   columnNameValueMap,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "updateRow",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().updateRow(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // deleteRow: function(
  //   tableId,
  //   columnNameValueMap,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "deleteRow",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().deleteRow(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // addRow: function(
  //   tableId,
  //   columnNameValueMap,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest("addRow", successCallbackFn, failureCallbackFn);
  //   this.getOdkDataIf().addRow(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // addCheckpoint: function(
  //   tableId,
  //   columnNameValueMap,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "addCheckpoint",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().addCheckpoint(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // saveCheckpointAsIncomplete: function(
  //   tableId,
  //   columnNameValueMap,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "saveCheckpointAsIncomplete",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().saveCheckpointAsIncomplete(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // saveCheckpointAsComplete: function(
  //   tableId,
  //   columnNameValueMap,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "saveCheckpointAsComplete",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().saveCheckpointAsComplete(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // deleteAllCheckpoints: function(
  //   tableId,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "deleteLastCheckpoint",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().deleteAllCheckpoints(
  //     tableId,
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // deleteLastCheckpoint: function(
  //   tableId,
  //   rowId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "deleteLastCheckpoint",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().deleteLastCheckpoint(
  //     tableId,
  //     rowId,
  //     this._getTableMetadataRevision(tableId),
  //     req._callbackId
  //   );
  // },
  // /********** LOCAL TABLE functions **********/
  // createLocalOnlyTableWithColumns: function(
  //   tableId,
  //   columnNameTypeMap,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "createLocalOnlyTableWithColumns",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().createLocalOnlyTableWithColumns(
  //     tableId,
  //     JSON.stringify(columnNameTypeMap),
  //     req._callbackId
  //   );
  // },
  // deleteLocalOnlyTable: function(
  //   tableId,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "deleteLocalOnlyTable",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().deleteLocalOnlyTable(tableId, req._callbackId);
  // },
  // insertLocalOnlyRow: function(
  //   tableId,
  //   columnNameValueMap,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "insertLocalOnlyRow",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   this.getOdkDataIf().insertLocalOnlyRow(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     req._callbackId
  //   );
  // },
  // updateLocalOnlyRows: function(
  //   tableId,
  //   columnNameValueMap,
  //   whereClause,
  //   sqlBindParams,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "updateLocalOnlyRows",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   // need to JSON.stringify bind parameters so we can pass integer, numeric and boolean parameters as-is.
  //   var sqlBindParamsJSON =
  //     sqlBindParams === null || sqlBindParams === undefined
  //       ? null
  //       : JSON.stringify(sqlBindParams);
  //   this.getOdkDataIf().updateLocalOnlyRows(
  //     tableId,
  //     JSON.stringify(columnNameValueMap),
  //     whereClause,
  //     sqlBindParamsJSON,
  //     req._callbackId
  //   );
  // },
  // deleteLocalOnlyRows: function(
  //   tableId,
  //   whereClause,
  //   sqlBindParams,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "deleteLocalOnlyRows",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   // need to JSON.stringify bind parameters so we can pass integer, numeric and boolean parameters as-is.
  //   var sqlBindParamsJSON =
  //     sqlBindParams === null || sqlBindParams === undefined
  //       ? null
  //       : JSON.stringify(sqlBindParams);
  //   this.getOdkDataIf().deleteLocalOnlyRows(
  //     tableId,
  //     whereClause,
  //     sqlBindParamsJSON,
  //     req._callbackId
  //   );
  // },
  // simpleQueryLocalOnlyTables: function(
  //   tableId,
  //   whereClause,
  //   sqlBindParams,
  //   groupBy,
  //   having,
  //   orderByElementKey,
  //   orderByDirection,
  //   limit,
  //   offset,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "simpleQueryLocalOnlyTables",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   var stringLimit = limit == null ? null : limit.toString();
  //   var stringOffset = offset == null ? null : offset.toString();
  //   // need to JSON.stringify bind parameters so we can pass integer, numeric and boolean parameters as-is.
  //   var sqlBindParamsJSON =
  //     sqlBindParams === null || sqlBindParams === undefined
  //       ? null
  //       : JSON.stringify(sqlBindParams);
  //   this.getOdkDataIf().simpleQueryLocalOnlyTables(
  //     tableId,
  //     whereClause,
  //     sqlBindParamsJSON,
  //     groupBy,
  //     having,
  //     orderByElementKey,
  //     orderByDirection,
  //     stringLimit,
  //     stringOffset,
  //     req._callbackId
  //   );
  // },
  // arbitrarySqlQueryLocalOnlyTables: function(
  //   tableId,
  //   sqlCommand,
  //   sqlBindParams,
  //   limit,
  //   offset,
  //   successCallbackFn,
  //   failureCallbackFn
  // ) {
  //   var req = this.queueRequest(
  //     "arbitrarySqlQueryLocalOnlyTables",
  //     successCallbackFn,
  //     failureCallbackFn
  //   );
  //   var stringLimit = limit == null ? null : limit.toString();
  //   var stringOffset = offset == null ? null : offset.toString();
  //   // need to JSON.stringify bind parameters so we can pass integer, numeric and boolean parameters as-is.
  //   var sqlBindParamsJSON =
  //     sqlBindParams === null || sqlBindParams === undefined
  //       ? null
  //       : JSON.stringify(sqlBindParams);
  //   this.getOdkDataIf().arbitrarySqlQueryLocalOnlyTables(
  //     tableId,
  //     sqlCommand,
  //     sqlBindParamsJSON,
  //     stringLimit,
  //     stringOffset,
  //     req._callbackId
  //   );
  // },
  // /*******************************************/
  // queueRequest: function(type, successCallbackFn, failureCallbackFn) {
  //   var cbId = this._callbackId++;
  //   var activeRequest = {
  //     _callbackId: cbId,
  //     _successCbFn: successCallbackFn,
  //     _failureCbFn: failureCallbackFn,
  //     _requestType: type
  //   };
  //   this._requestMap.push(activeRequest);
  //   var logStr = "";
  //   for (var i = 0; i < this._requestMap.length; i++) {
  //     logStr = logStr + ", " + this._requestMap[i]._callbackId;
  //   }
  //   odkCommon.log(
  //     "D",
  //     "odkData:queueRequest " +
  //       type +
  //       " cbId: " +
  //       cbId +
  //       " cbIds: " +
  //       logStr.substring(2)
  //   );
  //   return activeRequest;
  // },
  // invokeCallbackFn: function(jsonResult, cbId) {
  //   var found = false;
  //   if (cbId === null || cbId === undefined) {
  //     odkCommon.log(
  //       "E",
  //       "odkData:invokeCallbackFn called with null or undefined cbId"
  //     );
  //     return;
  //   }
  //   var errorMsg = null;
  //   if (jsonResult.error !== undefined && jsonResult.error !== null) {
  //     errorMsg = jsonResult.error;
  //   }
  //   var cbIdNum = parseInt(cbId);
  //   for (var i = 0; i < this._requestMap.length; i++) {
  //     if (this._requestMap[i]._callbackId === cbIdNum) {
  //       var trxn = this._requestMap[i];
  //       this._requestMap.splice(i, 1);
  //       if (errorMsg !== null && errorMsg !== undefined) {
  //         odkCommon.log(
  //           "E",
  //           "odkData invokeCallbackFn error - requestType: " +
  //             trxn._requestType +
  //             " callbackId: " +
  //             trxn._callbackId +
  //             " error: " +
  //             errorMsg
  //         );
  //         if (
  //           errorMsg.indexOf("org.opendatakit.exception.ActionNotAuthorize") ===
  //           0
  //         ) {
  //           document.body.innerHTML =
  //             "<h1>Access denied</h1>You do NOT have access to perform this action. Please log in or check your credentials."; // TODO: TEMPORARY
  //         }
  //         if (trxn._failureCbFn !== null && trxn._failureCbFn !== undefined) {
  //           trxn._failureCbFn(errorMsg);
  //         }
  //       } else {
  //         odkCommon.log(
  //           "D",
  //           "odkData invokeCallbackFn success - requestType: " +
  //             trxn._requestType +
  //             " callbackId: " +
  //             trxn._callbackId
  //         );
  //         // Need to update the cached KVS if we have a query request type
  //         //                     if (trxn._requestType === 'query') {
  //         //                         this.updateCachedMetadataForTableId(jsonResult, cbId);
  //         //                     }
  //         if (trxn._successCbFn !== null && trxn._successCbFn !== undefined) {
  //           var reqData = new this.__getResultData();
  //           reqData.setBackingObject(jsonResult);
  //           trxn._successCbFn(reqData);
  //         }
  //       }
  //       found = true;
  //     }
  //   }
  //   if (!found) {
  //     odkCommon.log(
  //       "E",
  //       "odkData invokeCallbackFn - no callback found for callbackId: " + cbId
  //     );
  //   }
  // },
  // responseAvailable: function() {
  //   setTimeout(function() {
  //     var resultJSON = this.getOdkDataIf().getResponseJSON();
  //     //odkCommon.log('D','odkData:resultJSON is ' + resultJSON);
  //     var result = JSON.parse(resultJSON);
  //     var callbackFnStr = result.callbackJSON;
  //     // odkCommon.log('D','odkData:callbackJSON is ' + callbackFnStr);
  //     this.invokeCallbackFn(result, callbackFnStr);
  //   }, 0);
  // },
  // //
  // // The code for the data object has
  // // been moved here since this is only
  // // accessed here
  // //
  // __getResultData: function() {
  //   /**
  //    * Returns true if str is a string, else false.
  //    */
  //   var isString = function(str) {
  //     return typeof str === "string";
  //   };
  //   /**
  //    * Returns ture if num is an integer, else false.
  //    */
  //   var isInteger = function(i) {
  //     return typeof i === "number" && Math.floor(i) === i;
  //   };
  //   // This is the object this will wrap up the result from an async query.
  //   var pub = {
  //     resultObj: null,
  //     _isNotEmptyObject: function(obj) {
  //       // !$.isEmptyObject(obj)
  //       var name;
  //       for (name in obj) {
  //         if (obj.hasOwnProperty(name)) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     },
  //     _expandMetadataCache: function(cachedMetadata) {
  //       // working variables for misc. data structure iteration
  //       var f;
  //       var i;
  //       // working variables for dataTableModel processing
  //       var defElement;
  //       // working variables for choiceListMap procesing
  //       var theList;
  //       var theMap;
  //       var choiceObject;
  //       // the dataTableModel returned from the Java layer is roughly a JSON schema and
  //       // does not have all of the persisted elementKey entries at the top level.
  //       // i.e., if they are in an object type (which is not persisted), the nested elements
  //       // this are persisted are not elevated up to the top level (they are just in their deeper
  //       // nesting within the object). Traverse the dataTableModel searching for the non-retained
  //       // elements, and if they are object types, collect their properties, appending them to
  //       // the top-level list and recursively traversing them.
  //       var fullDataTableModel = cachedMetadata.dataTableModel;
  //       // content to add to the fullDataTableModel
  //       var additionalDataTableModel = {};
  //       // working model fragment
  //       var dataTableModel;
  //       // model fragment to process on next pass
  //       var remainingDataTableModel = fullDataTableModel;
  //       // loop through until the model fragment for the next pass
  //       // (i.e., remainingDataTableModel) is empty
  //       //
  //       while (this._isNotEmptyObject(remainingDataTableModel)) {
  //         // make the next pass model the working model fragment
  //         dataTableModel = remainingDataTableModel;
  //         // clear the next pass model
  //         remainingDataTableModel = {};
  //         // iterate over the working model fragment scanning for
  //         // elements this are not retained.
  //         for (f in dataTableModel) {
  //           if (dataTableModel.hasOwnProperty(f)) {
  //             defElement = dataTableModel[f];
  //             if (defElement.notUnitOfRetention) {
  //               // if the element is an object, then accumulate
  //               // its properties into both the additionalDataTableModel
  //               // and the remainingDataTableModel. These will be
  //               // processed in the next iteration of this loop.
  //               if (defElement.type === "object") {
  //                 var sf;
  //                 var subDefElement;
  //                 for (sf in defElement.properties) {
  //                   if (defElement.properties.hasOwnProperty(sf)) {
  //                     subDefElement = defElement.properties[sf];
  //                     additionalDataTableModel[
  //                       subDefElement.elementKey
  //                     ] = subDefElement;
  //                     remainingDataTableModel[
  //                       subDefElement.elementKey
  //                     ] = subDefElement;
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       // copy all the additions into the full model.
  //       for (f in additionalDataTableModel) {
  //         if (additionalDataTableModel.hasOwnProperty(f)) {
  //           fullDataTableModel[f] = additionalDataTableModel[f];
  //         }
  //       }
  //       cachedMetadata._parsedChoiceListMap = {};
  //       cachedMetadata._parsedChoiceListValueMap = {};
  //       if (
  //         cachedMetadata.choiceListMap !== null &&
  //         cachedMetadata.choiceListMap !== undefined
  //       ) {
  //         // process the choiceListMap into _parsedChoiceListMap and _parsedChoiceListValueMap
  //         //
  //         // The Java side returns a choiceListMap map of choice_list_id => JSON string
  //         // 1. parse the JSON string -- yielding the ordered array of choice objects
  //         //    this identify the choice value and the display translation for this value.
  //         //    Store this in _parsedChoiceListMap (choice_list_id => parsed list).
  //         // 2. interate over the list producing a map of choice values to choice objects.
  //         //    Store this in _parsedChoiceListValueMap
  //         //         (choice_list_id => {map of choice value => choice object}).
  //         //
  //         for (f in cachedMetadata.choiceListMap) {
  //           if (cachedMetadata.choiceListMap.hasOwnProperty(f)) {
  //             theList = JSON.parse(cachedMetadata.choiceListMap[f]);
  //             theMap = {};
  //             for (i = 0; i < theList.length; ++i) {
  //               choiceObject = theList[i];
  //               theMap[choiceObject.data_value] = choiceObject;
  //             }
  //             cachedMetadata._parsedChoiceListMap[f] = theList;
  //             cachedMetadata._parsedChoiceListValueMap[f] = theMap;
  //           }
  //         }
  //       }
  //       // build the kvMap
  //       // The keyValueStoreList is traversed and transformed into the kvMap.
  //       //    cachedMetadata.kvMap[partition][aspect][key] = value
  //       //
  //       // If partition === 'Column' && key === 'displayChoicesList' then
  //       // add two new keys, '_displayChoicesList' and '_displayChoicesMap'
  //       // tying back to the structures maintained in
  //       //    cachedMetadata._parsedChoiceListMap
  //       //    cachedMetadata._parsedChoiceListValueMap
  //       //
  //       cachedMetadata.kvMap = {};
  //       if (
  //         cachedMetadata.keyValueStoreList === null ||
  //         cachedMetadata.keyValueStoreList === undefined
  //       ) {
  //         return;
  //       }
  //       var kvsLen = cachedMetadata.keyValueStoreList.length;
  //       odkCommon.log(
  //         "W",
  //         "odkData/setBackingObject: processing keyValueStoreList of size " +
  //           kvsLen
  //       );
  //       for (i = 0; i < kvsLen; i++) {
  //         var kvs = cachedMetadata.keyValueStoreList[i];
  //         if (!cachedMetadata.kvMap.hasOwnProperty(kvs.partition)) {
  //           cachedMetadata.kvMap[kvs.partition] = {};
  //         }
  //         var partition = cachedMetadata.kvMap[kvs.partition];
  //         if (!partition.hasOwnProperty(kvs.aspect)) {
  //           partition[kvs.aspect] = {};
  //         }
  //         var aspect = partition[kvs.aspect];
  //         aspect[kvs.key] = kvs;
  //         // Transform the choice list into a list.
  //         // Use _displayChoicesList as the key.
  //         // Transform the choice list into a map.
  //         // Use _displayChoicesMap as the key.
  //         if (
  //           kvs.partition === "Column" &&
  //           kvs.key === "displayChoicesList" &&
  //           kvs.value !== null
  //         ) {
  //           // save the parsed content
  //           var choiceList = cachedMetadata._parsedChoiceListMap[kvs.value];
  //           aspect["_displayChoicesList"] = choiceList;
  //           // create a map of choiceList data_value to object
  //           var choiceMap = cachedMetadata._parsedChoiceListValueMap[kvs.value];
  //           aspect["_displayChoicesMap"] = choiceMap;
  //         }
  //       }
  //     },
  //     /**
  //      * This function is used to set the
  //      * backing data object this all of the
  //      * member functions operate on
  //      *
  //      * jsonObj should be a JSON object.
  //      */
  //     setBackingObject: function(jsonObj) {
  //       this.resultObj = jsonObj;
  //       var metadataCache;
  //       var tableId = null;
  //       if (
  //         this.resultObj.metadata !== null &&
  //         this.resultObj.metadata !== undefined
  //       ) {
  //         tableId = this.resultObj.metadata.tableId;
  //       }
  //       // update odkData metadata cache if we receive an update
  //       if (
  //         this.resultObj.metadata !== null &&
  //         this.resultObj.metadata !== undefined &&
  //         this.resultObj.metadata.hasOwnProperty("cachedMetadata")
  //       ) {
  //         odkCommon.log(
  //           "W",
  //           "cachedMetadata present in " + tableId + " response"
  //         );
  //         // we have an update for the metadata cache
  //         metadataCache = this.resultObj.metadata.cachedMetadata;
  //         // expand the returned metadata so this we can efficiently use it.
  //         this._expandMetadataCache(metadataCache);
  //         // cache it
  //         this._putTableMetadata(tableId, metadataCache);
  //         // and remove the cachedMetadata
  //         delete this.resultObj.metadata.cachedMetadata;
  //       }
  //       // fetch the metadata cache
  //       metadataCache = this._getTableMetadata(tableId);
  //       if (metadataCache !== null && metadataCache !== undefined) {
  //         // apply the metadata cache
  //         var f;
  //         for (f in metadataCache) {
  //           if (metadataCache.hasOwnProperty(f)) {
  //             this.resultObj.metadata[f] = metadataCache[f];
  //           }
  //         }
  //       }
  //     },
  //     // get the number of rows in the result set
  //     getCount: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return 0;
  //       }
  //       if (this.resultObj.data === null || this.resultObj.data === undefined) {
  //         return 0;
  //       }
  //       return this.resultObj.data.length;
  //     },
  //     // convert the elementPath to a unique elementKey (column name in database)
  //     // assumes the elementPath is a unit of retention in the database.
  //     getElementKey: function(elementPath) {
  //       //
  //       var hackPath = elementPath.replace(/\./g, "_");
  //       return hackPath;
  //     },
  //     // get a vector of the values for the given elementKey.
  //     // useful for generating plots and graphs.
  //     // assumes the field is a unit of retention in the database
  //     getColumnData: function(elementKeyOrPath) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "getColumnData()--incorrect number of arguments";
  //       }
  //       if (!isString(elementKeyOrPath)) {
  //         throw "getColumnData()--elementKey not a string";
  //       }
  //       var elementKey = this.getElementKey(elementKeyOrPath);
  //       var colData = [];
  //       for (var i = 0; i < this.getCount(); i++) {
  //         colData.push(this.getData(i, elementKey));
  //       }
  //       return colData;
  //     },
  //     // get the _id (a.k.a. instance id -- a component of the PK)
  //     // of a row in the result set.
  //     getRowId: function(rowNumber) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (this.resultObj.data === null || this.resultObj.data === undefined) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "getRowId()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getRowId()--index must be an integer";
  //       }
  //       return this.getData(rowNumber, "_id");
  //     },
  //     // get the value for an individual field in a row of the result set
  //     // assumes the field is a unit of retention in the database
  //     getData: function(rowNumber, elementKeyOrPath) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (this.resultObj.data === null || this.resultObj.data === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.elementKeyMap === null ||
  //         this.resultObj.metadata.elementKeyMap === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 2) {
  //         throw "getData()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getData()--rowNumber must be an integer";
  //       }
  //       if (!isString(elementKeyOrPath)) {
  //         throw "getData()--elementKey must be a string";
  //       }
  //       var elementKey = this.getElementKey(elementKeyOrPath);
  //       var colIndex = this.resultObj.metadata.elementKeyMap[elementKey];
  //       return this.resultObj.data[rowNumber][colIndex];
  //     },
  //     // for singleton result sets, get the value of the given field.
  //     // assumes the field is a unit of retention in the database
  //     get: function(elementKeyOrPath) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "get()--incorrect number of arguments";
  //       }
  //       return this.getData(0, elementKeyOrPath);
  //     },
  //     //////////////////////////////////////////////////////////////////////////////
  //     // metadata content passed back for use in interpreting the result set
  //     getTableId: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata.tableId;
  //     },
  //     // get the limit setting for the number of rows in the result set
  //     getLimit: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       var retval = this.resultObj.metadata.limit;
  //       if (retval === undefined) {
  //         return null;
  //       }
  //       return retval;
  //     },
  //     // get the offset setting for the result set
  //     getOffset: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       var retval = this.resultObj.metadata.offset;
  //       if (retval === undefined) {
  //         return null;
  //       }
  //       return retval;
  //     },
  //     getColumns: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.elementKeyMap === null ||
  //         this.resultObj.metadata.elementKeyMap === undefined
  //       ) {
  //         return null;
  //       }
  //       var elementKeyMap = this.resultObj.metadata.elementKeyMap;
  //       var columns = [];
  //       var i;
  //       var key;
  //       for (key in elementKeyMap) {
  //         if (elementKeyMap.hasOwnProperty(key)) {
  //           i = elementKeyMap[key];
  //           columns[i] = key;
  //         }
  //       }
  //       return columns;
  //     },
  //     getRowForegroundColor: function(rowNumber) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.rowColors === null ||
  //         this.resultObj.metadata.rowColors === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "getRowForegroundColor()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getRowForegroundColor()--rowNumber must be an integer";
  //       }
  //       var colorArray = this.resultObj.metadata.rowColors;
  //       if (rowNumber >= 0 && rowNumber < this.getCount()) {
  //         for (var i = 0; i < colorArray.length; i++) {
  //           if (colorArray[i].rowIndex === rowNumber) {
  //             return colorArray[i].foregroundColor;
  //           }
  //         }
  //       }
  //       return null;
  //     },
  //     getRowBackgroundColor: function(rowNumber) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.rowColors === null ||
  //         this.resultObj.metadata.rowColors === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "getRowBackgroundColor()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getRowBackgroundColor()--rowNumber must be an integer";
  //       }
  //       var colorArray = this.resultObj.metadata.rowColors;
  //       if (rowNumber >= 0 && rowNumber < this.getCount()) {
  //         for (var i = 0; i < colorArray.length; i++) {
  //           if (colorArray[i].rowIndex === rowNumber) {
  //             return colorArray[i].backgroundColor;
  //           }
  //         }
  //       }
  //       return null;
  //     },
  //     getStatusForegroundColor: function(rowNumber) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.statusColors === null ||
  //         this.resultObj.metadata.statusColors === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "getStatusForegroundColor()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getStatusForegroundColor()--rowNumber must be an integer";
  //       }
  //       var colorArray = this.resultObj.metadata.statusColors;
  //       if (rowNumber >= 0 && rowNumber < this.getCount()) {
  //         for (var i = 0; i < colorArray.length; i++) {
  //           if (colorArray[i].rowIndex === rowNumber) {
  //             return colorArray[i].foregroundColor;
  //           }
  //         }
  //       }
  //       return null;
  //     },
  //     getStatusBackgroundColor: function(rowNumber) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.statusColors === null ||
  //         this.resultObj.metadata.statusColors === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 1) {
  //         throw "getStatusBackgroundColor()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getStatusBackgroundColor()--rowNumber must be an integer";
  //       }
  //       var colorArray = this.resultObj.metadata.statusColors;
  //       if (rowNumber >= 0 && rowNumber < this.getCount()) {
  //         for (var i = 0; i < colorArray.length; i++) {
  //           if (colorArray[i].rowIndex === rowNumber) {
  //             return colorArray[i].backgroundColor;
  //           }
  //         }
  //       }
  //       return null;
  //     },
  //     getColumnForegroundColor: function(rowNumber, elementKeyOrPath) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.columnColors === null ||
  //         this.resultObj.metadata.columnColors === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 2) {
  //         throw "getColumnForegroundColor()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getColumnForegroundColor()--rowNumber must be an integer";
  //       }
  //       if (!isString(elementKeyOrPath)) {
  //         throw "getColumnForegroundColor()--elementKey must be a string";
  //       }
  //       var elementKey = this.getElementKey(elementKeyOrPath);
  //       if (
  //         this.resultObj.metadata.columnColors[elementKey] === null ||
  //         this.resultObj.metadata.columnColors[elementKey] === undefined
  //       ) {
  //         return null;
  //       }
  //       var colorArray = this.resultObj.metadata.columnColors[elementKey];
  //       if (rowNumber >= 0 && rowNumber < this.getCount()) {
  //         for (var i = 0; i < colorArray.length; i++) {
  //           if (colorArray[i].rowIndex === rowNumber) {
  //             return colorArray[i].foregroundColor;
  //           }
  //         }
  //       }
  //       return null;
  //     },
  //     getColumnBackgroundColor: function(rowNumber, elementKeyOrPath) {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.columnColors === null ||
  //         this.resultObj.metadata.columnColors === undefined
  //       ) {
  //         return null;
  //       }
  //       if (arguments.length !== 2) {
  //         throw "getColumnBackgroundColor()--incorrect number of arguments";
  //       }
  //       if (!isInteger(rowNumber)) {
  //         throw "getColumnBackgroundColor()--rowNumber must be an integer";
  //       }
  //       if (!isString(elementKeyOrPath)) {
  //         throw "getColumnBackgroundColor()--elementKey must be a string";
  //       }
  //       var elementKey = this.getElementKey(elementKeyOrPath);
  //       if (
  //         this.resultObj.metadata.columnColors[elementKey] === null ||
  //         this.resultObj.metadata.columnColors[elementKey] === undefined
  //       ) {
  //         return null;
  //       }
  //       var colorArray = this.resultObj.metadata.columnColors[elementKey];
  //       if (rowNumber >= 0 && rowNumber < this.getCount()) {
  //         for (var i = 0; i < colorArray.length; i++) {
  //           if (colorArray[i].rowIndex === rowNumber) {
  //             return colorArray[i].backgroundColor;
  //           }
  //         }
  //       }
  //     },
  //     getMapIndex: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.mapIndex === null ||
  //         this.resultObj.metadata.mapIndex === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata.mapIndex;
  //     },
  //     getColumnDisplayName: function(elementKeyOrPath) {
  //       var retVal = elementKeyOrPath;
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata.keyValueStoreList === null ||
  //         this.resultObj.metadata.keyValueStoreList === undefined
  //       ) {
  //         return retVal;
  //       }
  //       var ref = this.resultObj.metadata.kvMap["Column"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       var elementKey = this.getElementKey(elementKeyOrPath);
  //       ref = ref[elementKey];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       ref = ref["displayName"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       retVal = ref.value;
  //       return retVal;
  //     },
  //     getTableDisplayName: function(tableId) {
  //       var retVal = tableId;
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata.keyValueStoreList === null ||
  //         this.resultObj.metadata.keyValueStoreList === undefined
  //       ) {
  //         return retVal;
  //       }
  //       var ref = this.resultObj.metadata.kvMap["Table"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       ref = ref["default"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       ref = ref["displayName"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       retVal = ref.value;
  //       return retVal;
  //     },
  //     getIsTableLocked: function() {
  //       var retVal = false;
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata.keyValueStoreList === null ||
  //         this.resultObj.metadata.keyValueStoreList === undefined
  //       ) {
  //         return retVal;
  //       }
  //       var ref = this.resultObj.metadata.kvMap["Table"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       ref = ref["security"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       ref = ref["locked"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       var v = ref.value;
  //       if (v !== null && v !== undefined && v.toLowerCase() == "true") {
  //         retVal = true;
  //       }
  //       return retVal;
  //     },
  //     getCanCreateRow: function() {
  //       var retVal = false;
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return retVal;
  //       }
  //       return this.resultObj.metadata.canCreateRow;
  //     },
  //     //
  //     // Retrieves the list of choices for the given elementPath
  //     // or null if there is not a list of choices in the table
  //     // properties for this column. This is the already-JSON-parsed
  //     // value. The list order is the order in which these choices
  //     // should be presented in the selection-list.
  //     getColumnChoicesList: function(elementPath) {
  //       var retVal = null;
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata.keyValueStoreList === null ||
  //         this.resultObj.metadata.keyValueStoreList === undefined
  //       ) {
  //         return retVal;
  //       }
  //       var ref = this.resultObj.metadata.kvMap["Column"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       var elementKey = this.getElementKey(elementPath);
  //       ref = ref[elementKey];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       // NOTE: this is synthesized within setBackingObject()
  //       ref = ref["_displayChoicesList"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       retVal = ref;
  //       return retVal;
  //     },
  //     //
  //     // Effectively retrieves the object for the given data_value from
  //     // the displayChoicesList for the given elementPath. Equivalent to
  //     // searching through the '_displayChoicesList' value for the object
  //     // where object.data_value === choiceDataValue.
  //     //
  //     // The caller can then access the .display.title for the
  //     // text translation of this object or any custom property
  //     // associated with this choice data value (via the tableId form).
  //     getColumnChoiceDataValueObject: function(elementPath, choiceDataValue) {
  //       var retVal = null;
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return retVal;
  //       }
  //       if (
  //         this.resultObj.metadata.keyValueStoreList === null ||
  //         this.resultObj.metadata.keyValueStoreList === undefined
  //       ) {
  //         return retVal;
  //       }
  //       var ref = this.resultObj.metadata.kvMap["Column"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       var elementKey = this.getElementKey(elementPath);
  //       ref = ref[elementKey];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       // NOTE: this is synthesized within setBackingObject()
  //       ref = ref["_displayChoicesMap"];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       ref = ref[choiceDataValue];
  //       if (ref === null || ref === undefined) {
  //         return retVal;
  //       }
  //       retVal = ref;
  //       return retVal;
  //     },
  //     // may need to get the raw metadata content to get access to some of the content.
  //     getMetadata: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata;
  //     },
  //     // only valid after call to getAllTableIds()
  //     getAllTableIds: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.tableIds === null ||
  //         this.resultObj.metadata.tableIds === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata.tableIds;
  //     },
  //     // only valid after call to getRoles()
  //     getRoles: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.roles === null ||
  //         this.resultObj.metadata.roles === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata.roles;
  //     },
  //     // only valid after call to getDefaultGroup()
  //     getDefaultGroup: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.defaultGroup === null ||
  //         this.resultObj.metadata.defaultGroup === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata.defaultGroup;
  //     },
  //     // only valid after call to getUsers()
  //     getUsers: function() {
  //       if (this.resultObj === null || this.resultObj === undefined) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata === null ||
  //         this.resultObj.metadata === undefined
  //       ) {
  //         return null;
  //       }
  //       if (
  //         this.resultObj.metadata.users === null ||
  //         this.resultObj.metadata.users === undefined
  //       ) {
  //         return null;
  //       }
  //       return this.resultObj.metadata.users;
  //     }
  //   };
  //   return pub;
  // }
}

//tslint:disable
// interface IWindow extends Window {
// odkDataIf: typeof OdkDataIf;
// odkData: IODKData;
// odkCommon: IODKCommon;
// }
// declare const window: IWindow;
// interface IODKData {}
// interface IODKCommon {}

// window.odkDataIf = OdkDataIf;

// const odkCommon = {
//   log: (...args) => console.log(...args)
// };
