const fs = require("fs-extra");
const path = require("path");
const child = require("child_process");

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const frontendPath = path.join(rootPath, "frontend");

/**
 * Copy framework and tables xlsx files from the parent forms folder
 * to the application directory, and process for use in ODK/
 * Build and copy frontend
 */
async function main() {
  console.log("copying data...");
  // copy forms
  await fs.copy(
    "forms/framework.xlsx",
    `${designerPath}/app/config/assets/framework/forms/framework/framework.xlsx`
  );
  await fs.copy("forms/tables", `${designerPath}/app/config/tables`);
  process.chdir("./designer");
  child.spawnSync("grunt", ["xlsx-convert-all"], {
    cwd: designerPath,
    stdio: ["ignore", "inherit", "inherit"],
    shell: true
  });
  // build and copy frontend
  console.log("building app...");
  child.spawnSync("npm", ["run", "build"], {
    cwd: frontendPath,
    stdio: "inherit",
    shell: true
  });
  await fs.copy(`${frontendPath}/build`, `${designerPath}/app/config/assets`);
  console.log("build complete");
}
main().catch(handleError);

function handleError(err) {
  if (err) {
    throw err;
  }
}
