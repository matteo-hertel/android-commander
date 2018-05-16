const android = require("./platforms/android");
const utils = require("./utils");
main();

async function main() {
  const video = android.video("toggle");
  video.start();
  const tmp = await android.tap("525", "953");
  console.log(tmp);
  await utils.wait(1000);
  video.stop();
  await video.get();
  //await video.remove();
}
