const watch = require("node-watch");
const path = require("path");
const child = require("child_process");

const rootPath = process.cwd();
const formsPath = path.join(rootPath, "forms");

/**
 * Automatically watch for changes to form xlsx files
 * and run prepare scripts on change
 */
console.log("Watching for XLSX form changes");
watch(formsPath, { recursive: true }, function (evt, name) {
  if (name.includes(".xlsx") && !name.includes("~$")) {
    console.log("%s changed.", name);
    // TODO - better if can bind to specific file convert script
    // to only process files that have changes
    child.spawnSync("npm run prepare", {
      cwd: rootPath,
      stdio: "inherit",
      shell: true,
    });
  }
});
