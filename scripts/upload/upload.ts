import { uploadTables } from "./upload-tables";
import { uploadFiles } from "./upload-files";

async function main() {
  await uploadTables();
  await uploadFiles();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });
