const fs = require("fs-extra");
const path = require("path");
const child = require("child_process");

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");
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
  await fs.ensureDir(`${designerAssetsPath}/build`);
  await fs.emptyDir(`${designerAssetsPath}/build`);
  child.spawnSync("npm run build:odk", {
    cwd: frontendPath,
    stdio: "inherit",
    shell: true
  });
  console.log("build complete, copying files");
  await fs.copy(`${frontendPath}/build`, `${designerAssetsPath}/build`);
  await rewriteIndexes();
  // rewrite app designer index to load build index instead
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
  // also uncomment odk import scripts from build
  const buildIndexPath = `${designerAssetsPath}/build/index.html`;
  let buildIndex = await fs.readFile(buildIndexPath, "utf8");
  buildIndex = buildIndex.replace("<!--odk", "").replace("odk-->", "");
  await fs.writeFile(buildIndexPath, buildIndex);
}

function handleError(err) {
  if (err) {
    throw err;
  }
}
