const fs = require("fs-extra");
const path = require("path");
const child = require("child_process");
const { recFindByExt } = require("./utils");

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");
const frontendPath = path.join(rootPath, "frontend");

async function run() {
  console.log("copying data...");
  // populate sample files if not already present, {destination:source} mapping
  const sampleFiles = {
    "forms/framework.xlsx": "forms/framework.sample.xlsx",
    "forms/csv/tables.init": "forms/csv/tables.sample.init",
    "forms/app.properties": "forms/app.sample.properties",
  };
  for (let [destination, source] of Object.entries(sampleFiles)) {
    const exists = await fs.exists(destination);
    if (!exists) {
      await fs.copyFile(source, destination);
    }
  }
  // copy forms
  await ensureCopy(
    "forms/framework.xlsx",
    `${designerAssetsPath}/framework/forms/framework/framework.xlsx`
  );
  await ensureCopy("forms/tables", `${designerPath}/app/config/tables`, true);

  // process forms, call npx in case not installed globally
  child.spawnSync("npx grunt", ["xlsx-convert-all"], {
    cwd: designerPath,
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
  // copy preload data
  await ensureCopy("forms/csv", `${designerAssetsPath}/csv`, true);
  await fs.move(
    `${designerAssetsPath}/csv/tables.init`,
    `${designerAssetsPath}/tables.init`,
    {
      overwrite: true,
    }
  );
  await ensureCopy(
    "forms/app.properties",
    `${designerAssetsPath}/app.properties`
  );

  // copy back json and csv data in case frontend wants to access
  await ensureCopy(`forms/csv`, `${frontendPath}/src/assets/odk/csv`, true);
  await ensureCopy(
    `${designerPath}/app/config/assets/framework/forms/framework/formDef.json`,
    `${frontendPath}/src/assets/odk/framework.json`
  );
  const jsonFilepaths = await recFindByExt(
    `${designerPath}/app/config/tables`,
    "json"
  );
  for (let filepath of jsonFilepaths) {
    const source = path.resolve(`${designerPath}/app/config`);
    const dest = `${frontendPath}/src/assets/odk`;
    const destination = path.normalize(filepath).replace(source, dest);
    await fs.copy(filepath, destination);
  }
}
run();

/**
 * Copy files, ensuring target folder exists and overwriting any existing data
 * @param emptyDir - Optionally empty directory before copy
 */
async function ensureCopy(src, dest, emptyDir = false) {
  const isDirectory = (await fs.stat(src)).isDirectory();
  const destDirectory = isDirectory ? dest : path.dirname(dest);
  await fs.ensureDir(destDirectory);
  if (emptyDir) {
    await fs.emptyDir(dest);
  }
  await fs.copy(src, dest, { overwrite: true }).catch((err) => {
    console.error("\x1b[31m", `ERROR: could not copy ${src} -> ${dest}`);
    process.exitCode = 1;
  });
}
