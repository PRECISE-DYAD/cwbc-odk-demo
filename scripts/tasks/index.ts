import * as chalk from "chalk";
import { promptOptions } from "../utils";

import { exampleTask1 } from "./exampleTasks";

/** Available tasks should be imported and included in this list */
const TASK_LIST = [exampleTask1];

async function main() {
  let specifiedTask = process.argv[2];
  if (!specifiedTask) {
    specifiedTask = await promptOptions(TASK_LIST, "Which task would you like to run?");
  }
  const task = TASK_LIST.find((t) => specifiedTask === t.name);
  if (task) {
    await task();
  } else {
    console.log(chalk.red("No task found, did you include it in the TASK_LIST"));
  }
}
main();
