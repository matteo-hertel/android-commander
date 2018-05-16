const spawn = require("child_process").spawn;

function command(command, ...args) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, args);
    cmd.stderr.on("data", data => {
      reject(data);
    });
    cmd.on("close", code => {
      resolve(code);
    });
  });
}
function rawCommand(command, ...args) {
  return spawn(command, args);
}
async function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
module.exports = {
  rawCommand,
  command,
  wait
};
