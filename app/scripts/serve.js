var serveStatic = require("serve-static");
var http = require("http");

// Serve frontend app
var main = serveStatic("app", {
    index: ["index.html"]
});
var assets = serveStatic("app/config/assets", {
    index: ["index.html"]
});

var server = http.createServer(function onRequest(req, res) {
    return main(req, res, function() {
        assets(req, res, handleError(req, res));
    });
});

function handleError(req, res) {
    console.log("not found:", req.url);
}

// Listen
console.log("server listening on port 3000");
server.listen(3000);
