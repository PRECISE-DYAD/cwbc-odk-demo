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
            console.log("enabling iframe access",mockImpl);
            exposeWindowToParentHost();
            notifyParentReady();
            runDBTransaction();
        }
    }
    function runDBTransaction() {
        // all database operations are run with a context for callbacks
        const defaultContext = {
            failure: (data) => postMessage({ type: "error", data }),
            success: (data) => postMessage({ type: "res", data }),
            log: (data) => postMessage({ type: "log", data }),
        };
        mockImpl.withDb(defaultContext, function (tx) {
            tx.executeSql(
                'SELECT tbl_name from sqlite_master WHERE type = "table"',
                [],
                function (tx, results) {
                    console.log("results", results);
                    // callback(results, processResultSet);
                }
            );
        });
    }
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
    // supress logs and errors from deisgner console logs (keep errors, but all debug logs are a bit much)
    function reduceLogging() {
        const defaultLog = console.log;
        const defaultErr = console.error;
        console.log = (...data) => {
            if (data[0] && data[0].indexOf("/") == 1) {
                return null;
            } else {
                defaultLog(...data);
            }
        };
        console.error = (...data) => {
            if (data[0] && data[0].indexOf("/") == 1) {
                return null;
            } else {
                defaultErr(...data);
            }
        };
    }
    return {};
});
