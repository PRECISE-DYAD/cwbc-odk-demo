/**
 * Specific overrides not part of core designer system package
 * (and hence only available during development mode)
 *
 * Used to allow direct access to the application designer window
 * (served on localhost:8000) from the app (served on localhost:4200)
 */

// Custom script to allow access to the designer window object during development mode
// when embedded as an iframe from other applications on localhost
// https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy

// Load the overrides once the mockDB is ready
define(["mockImpl"], function (mockImpl) {
    /* global odkCommon */
    "use strict";
    if (location.hostname === "localhost") {
        reduceLogging();
        try {
            const parent = window.parent.location;
            console.log("parent", parent.location);
        } catch (error) {
            // if can't access parent then running within iframe on different port, expose
            console.log("enabling iframe access", mockImpl);
            exposeWindowToParentHost();
            notifyParentReady();
        }
    }
    /***************************************************************************
     * Mock implementation overrides
     ***************************************************************************/
    // Override default method that relies on reading formdef files to run query against any sql table
    window.odkData.arbitrarySqlQueryLocalOnlyTables = (
        tableId,
        sqlCommand,
        sqlBindParams,
        limit,
        offset,
        successCallbackFn,
        failureCallbackFn
    ) => {
        const sql = {
            statement: sqlCommand,
            bind: sqlBindParams,
        };
        executeSql(
            sql,
            (res) =>
                successCallbackFn(
                    processResultObject(res, tableId, limit, offset)
                ),
            (err) => {
                console.error(err);
                failureCallbackFn(err);
            }
        );
    };
    /**
     * local sql queries return rows of entries formatted as json, but requires converting to match
     * format from java which separates out values and a elementKeyMap
     */
    function processResultObject(res, tableId, limit = -1, offset = -1) {
        const elementKeyMap = {};
        const data = [];
        if (res.rows.length > 0) {
            Object.keys(res.rows[0]).forEach(
                (key, index) => (elementKeyMap[key] = index)
            );
            Object.values(res.rows).forEach((row) =>
                data.push(Object.values(row))
            );
        }
        const metadata = { tableId, limit, offset, elementKeyMap };
        // TODO - if implementing queue include number in callbackJSON
        return { resultObj: { callbackJSON: "N/A", data, metadata } };
    }

    // Method doesn't exist in mock implementation, but does for java so recreate
    window.odkData.getAllTableIds = (successCallbackFn, failureCallbackFn) => {
        // use bind to bind variables to paremeters indicated with '?'
        const sql = {
            statement: "SELECT * from _table_definitions",
            bind: [],
        };
        // alt sql to get all tables: 'SELECT tbl_name from sqlite_master WHERE type = "table"'
        executeSql(
            sql,
            (res) => {
                // reformat response to match expected
                const tableIds = Object.values(res.rows);
                const resultObj = { metadata: { tableIds } };
                successCallbackFn({ resultObj });
            },
            (err) => failureCallbackFn(err)
        );
    };

    // helper function to execut sql on sqlite db
    function executeSql(sql, successCallbackFn, failureCallbackFn) {
        // console.log("executing sql", sql);
        // all database operations are run with a context for callbacks
        // these don't share data and are more to retrieve responses elsewhere
        // currently bypassing to run success callbacks direct (and not use queue system)
        // as more tricky to figure out
        const defaultContext = {
            failure: (err) => failureCallbackFn(err),
            success: (...args) => console.log("sql success", args),
            log: (...data) => console.log("sql log", data),
        };
        mockImpl.withDb(defaultContext, function (tx) {
            tx.executeSql(sql.statement, sql.bind, function (tx, results) {
                successCallbackFn(results);
            });
        });
    }

    /***************************************************************************
     * Iframe cross-communication
     ***************************************************************************/
    function postMessage(message) {
        console.log("postMessage", message);
    }
    // listeners on parent iframe will be informed that the window is ready for access
    function notifyParentReady() {
        window.parent.postMessage("odk:ready", "*");
    }
    function exposeWindowToParentHost() {
        document.domain = "localhost";
    }
    /***************************************************************************
     * Misc
     ***************************************************************************/
    // supress logs and errors from deisgner console logs (keep errors, but all debug logs are a bit much)
    function reduceLogging() {
        const defaultLog = console.log;
        const defaultErr = console.error;
        console.log = (...data) => {
            if (data &&
                data[0] &&
                typeof data[0] === "string" &&
                data[0].indexOf("/") == 1) {
                return null;
            } else {
                defaultLog(...data);
            }
        };
        console.error = (...data) => {
            if (
                data &&
                data[0] &&
                typeof data[0] === "string" &&
                data[0].indexOf("/") == 1
            ) {
                return null;
            } else {
                defaultErr(...data);
            }
        };
    }
    return {};
});
