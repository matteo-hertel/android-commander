const android = require("./platforms/android");
const utils = require("./utils");
const program = require("commander");
const commandPool = Object.assign({}, android.actions, utils);

program
  .version("0.0.1")
  .description("Script and save a video of an android interaction")
  .option("-f, --file <s>", "Component file definition")
  .parse(process.argv);

main(program.file);

async function main(component) {
  const command = require(`./../mocks/${component}.json`);
  const video = android.video(command.name);

  video.start();

  async function processCommand(cmd) {}

  for (let cmd of command.workflow) {
    const [action] = Object.keys(cmd);
    await commandPool[action](...cmd[action]);
  }

  video.stop();
  await utils.wait(1000);
  await video.get();
  await video.remove();
  console.log(`Video file saved to ${command.name}`);
}
