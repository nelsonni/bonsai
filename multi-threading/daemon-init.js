var startDaemon = (type) => {
  const cp = require('child_process');
  const n = cp.fork(__dirname + "/" + type + ".js", {
    detached: true
  });
  return n;
}
module.exports = startDaemon;