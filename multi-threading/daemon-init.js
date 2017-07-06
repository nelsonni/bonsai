var startDaemon = (type) => {
  const cp = require('child_process');
  console.log(__dirname + "/" + type + ".js")
  const n = cp.fork(__dirname + "/" + type + ".js", {
    detached: true
  });
  return n;
}
module.exports = startDaemon;