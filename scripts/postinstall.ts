import * as chalk from "chalk";
import { spawnSync } from "child_process";

function main() {
  console.log(chalk.blue("Checking Designer Files"));
  spawnSync("yarn install --ignore-scripts --silent", {
    cwd: "./designer",
    stdio: "inherit",
    shell: true,
  });
  console.log(chalk.blue("Checking Frontend Files"));
  spawnSync("yarn install --ignore-scripts --silent", {
    cwd: "./frontend",
    stdio: "inherit",
    shell: true,
  });
}
main();
