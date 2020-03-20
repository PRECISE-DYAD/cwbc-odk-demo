const child = require("child_process");

function main() {
  child.spawnSync("npm install", {
    cwd: "./designer",
    stdio: "inherit",
    shell: true
  });
  child.spawnSync("npm install", {
    cwd: "./frontend",
    stdio: "inherit",
    shell: true
  });
}
main();
