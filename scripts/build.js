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
  // build and copy frontend
  // Angular - build basehref used
  console.log("building app...");
  child.spawnSync("ng build --prod --baseHref=/default/config/assets/build/", {
    cwd: frontendPath,
    stdio: "inherit",
    shell: true
  });
  await fs.ensureDir(`${designerPath}/app/config/assets/build`);
  await fs.emptyDir(`${designerPath}/app/config/assets/build`);
  await fs.copy(
    `${frontendPath}/build`,
    `${designerPath}/app/config/assets/build`
  );
  await rewriteIndexes();
  // rewrite app designer index to load build index instead
  console.log("build complete");
}
main().catch(handleError);

async function rewriteIndexes() {
  // rewrite the default odk tables index to redirect to the app build folder
  // NOTE - could just replace full assets folder content but more risky as additional
  // files are populated there and used by application designer
  await fs.writeFile(
    `${designerPath}/app/config/assets/index.html`,
    `
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
  <html>
      <head>
          <!-- redirect index to build folder -->
          <meta http-equiv="Refresh" content="0;url=build/" />
      </head>
  </html>
  `
  );
}

function handleError(err) {
  if (err) {
    throw err;
  }
}
