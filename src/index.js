const android = require("./platforms/android");
const iosRecorder = require("./../src/platforms/ios/recorder.js");
const utils = require("./utils");
const program = require("commander");
const StorybookController = require("./storybook-controller");
const commandPool = Object.assign({}, android.actions, utils);

program
  .version("0.0.1")
  .description("Script and save a video of an android interaction")
  .option("-f, --file <s>", "Component file definition")
  .parse(process.argv);

const component = require(`./../mocks/${program.file}.json`);

Promise.all([
  androidProcess(component)
  //iosProcess(component)
]);

async function androidProcess(definiton) {
  const video = android.video(definiton.name);
  await activateComponent(definiton.storybook);
  video.start();

  async function processCommand(cmd) {}

  for (let cmd of definiton.workflow) {
    const [action] = Object.keys(cmd);
    await commandPool[action](...cmd[action]);
  }

  video.stop();
  await utils.wait(1000);
  await video.get();
  await video.remove();
  console.log(`Android video file saved to ${definiton.name}`);
}

async function iosProcess(definiton) {
  const recorder = new iosRecorder(`${definiton.name}-ios.mp4`);
  await recorder.startRecording();
  await utils.wait(5200);
  await recorder.finishRecording();
  console.log(`iOS video file saved to ${definiton.name}`);
}

async function activateComponent(storybook) {
  const controller = new StorybookController(storybook.url);
  await controller.start();
  await controller.activateStory(storybook.kind, storybook.story);
  await utils.wait(1000);
  await controller.done();
}
