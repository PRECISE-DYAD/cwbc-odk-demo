import { uploadTableDefinitions } from "./upload-tables";
import { uploadFiles } from "./upload-files";

async function main() {
  // await uploadFiles();
  await uploadTableDefinitions();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    throw err;
  });
