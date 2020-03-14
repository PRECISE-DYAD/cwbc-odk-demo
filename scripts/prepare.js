const fs = require("fs-extra");
const path = require("path");
const child = require("child_process");

const rootPath = process.cwd();
const designerPath = path.join(rootPath, "designer");
const frontendPath = path.join(rootPath, "frontend");

async function main() {
  console.log("preparing data");
  console.log("copying data...");
  // copy forms
  await fs.copy(
    "forms/framework.xlsx",
    `${designerPath}/app/config/assets/framework/forms/framework/framework.xlsx`
  );
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
    console.log(filepath, destination);
    await fs.copy(filepath, destination);
  }
  // console.log("json", jsonFilepaths);
}
main();

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
