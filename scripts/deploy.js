// push app to device via adb grunt methods
function main() {
  const child = require("child_process");
  child.spawnSync("npx grunt adbpush", {
    stdio: "inherit",
    cwd: "./designer",
    shell: true
  });
}
main();
