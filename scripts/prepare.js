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
  };
  for (let [destination, source] of Object.entries(sampleFiles)) {
    const exists = await fs.exists(destination);
    if (!exists) {
      await fs.copyFile(source, destination);
    }
  }
  // copy forms
  await cleanCopy(
    "forms/framework.xlsx",
    `${designerAssetsPath}/framework/forms/framework/framework.xlsx`
  );

  await cleanCopy("forms/tables", `${designerPath}/app/config/tables`);
  // process forms, call npx in case not installed globally
  child.spawnSync("npx grunt", ["xlsx-convert-all"], {
    cwd: designerPath,
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
  });
  // copy preload data
  await cleanCopy("forms/csv", `${designerAssetsPath}/csv`);
  await fs.move(
    `${designerAssetsPath}/csv/tables.init`,
    `${designerAssetsPath}/tables.init`,
    {
      overwrite: true,
    }
  );
  // copy back json and csv data in case frontend wants to access
  await fs.cleanCopy(`forms/csv`, `${frontendPath}/src/assets/odk/csv`);
  await fs.cleanCopy(
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
 */
async function cleanCopy(src, dest) {
  const isDirectory = (await fs.stat(src)).isDirectory();
  const destDirectory = isDirectory ? dest : path.dirname(dest);
  await fs.ensureDir(destDirectory);
  await fs.copy(src, dest, { overwrite: true }).catch((err) => {
    console.error("\x1b[31m", `ERROR: could not copy ${src} -> ${dest}`);
    process.exitCode = 1;
  });
}
