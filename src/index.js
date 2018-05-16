const android = require("./platforms/android");
const utils = require("./utils");
const program = require("commander");
const StorybookController = require("./storybook-controller");
const commandPool = Object.assign({}, android.actions, utils);

program
  .version("0.0.1")
  .description("Script and save a video of an android interaction")
  .option("-f, --file <s>", "Component file definition")
  .parse(process.argv);

main(program.file);

async function main(component) {
  const definiton = require(`./../mocks/${component}.json`);
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
  console.log(`Video file saved to ${definiton.name}`);
}
async function activateComponent(storybook) {
  const controller = new StorybookController(storybook.url);
  await controller.start();
  await controller.activateStory(storybook.kind, storybook.story);
  await utils.wait(1000);
  await controller.done();
}
