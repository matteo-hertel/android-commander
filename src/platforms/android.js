const { rawCommand, command, wait } = require("./../utils");

async function tap(x, y) {
  return command("adb", "shell", "input", "tap", x, y);
}
function video(filename) {
  let handler;
  function start() {
    handler = rawCommand(
      "adb",
      "shell",
      "screenrecord",
      " --bit-rate",
      "6000000",
      `/sdcard/${filename}.mp4`
    );
  }
  function stop() {
    if (!handler) {
      throw "Cannot call stop video if the process has not being started";
    }
    handler.kill("SIGINT");
    handler.stdin.write("\n");
  }
  async function get() {
    return wait(1000)
      .then(command("adb", "pull", `/sdcard/${filename}.mp4`))
      .then(wait(1000));
  }
  async function remove() {
    return command("adb", "shell", "rm", "-f", `/sdcard/${filename}.mp4`);
  }
  return {
    stop,
    start,
    get,
    remove
  };
}
module.exports = {
  actions: { tap },
  video
};
