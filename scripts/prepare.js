const fs = require("fs-extra");
const path = require("path");
const child = require("child_process");

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const designerAssetsPath = path.join(designerPath, "app/config/assets");
const frontendPath = path.join(rootPath, "frontend");

async function main() {
  console.log("copying data...");

  // TODO - Clear directories (some done in build)

  // copy forms
  await fs.ensureDir(`${designerAssetsPath}/framework/forms`);
  await fs.emptyDir(`${designerAssetsPath}/framework/forms`);
  await fs
    .copy(
      "forms/framework.xlsx",
      `${designerAssetsPath}/framework/forms/framework/framework.xlsx`
    )
    .catch(err => {
      console.error(
        "\x1b[31m",
        "ERROR: No Framework.xlsx provided in forms directory"
      );
      process.exit(1);
    });
  await fs.ensureDir(`${designerPath}/app/config/tables`);
  await fs.emptyDir(`${designerPath}/app/config/tables`);
  await fs.copy("forms/tables", `${designerPath}/app/config/tables`);
  // process forms
  child.spawnSync("grunt", ["xlsx-convert-all"], {
    cwd: designerPath,
    stdio: ["ignore", "inherit", "inherit"],
    shell: true
  });
  // copy back json
  await fs.copy(
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
main();

// find files by a given extension recursively, returning full paths
async function recFindByExt(base, ext, files, result) {
  files = files || (await fs.readdir(base));
  result = result || [];
  for (const file of files) {
    const newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      const newFiles = await fs.readdir(newbase);
      result = await recFindByExt(newbase, ext, newFiles, result);
    } else {
      if (file.split(".").pop() === ext) {
        result.push(newbase);
      }
    }
  }
  return result;
}