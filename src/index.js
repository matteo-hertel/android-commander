const android = require("./platforms/android");
const utils = require("./utils");
main();

async function main() {
  const video = android.video("toggle");
  video.start();
  await android.tap("525", "953");
  await utils.wait(1000);
  await android.tap("525", "1098");
  await utils.wait(1000);
  video.stop();
  await utils.wait(1000);
  await video.get();
  await utils.wait(1000);
  await video.remove();
}
