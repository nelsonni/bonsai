console.log("Worker: ", process.pid, " ready to work")
const fs = require("fs")
process.on("message", (m) => {
  fs.writeFile((m.fileName).toString(), m.data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(process.pid, "The file was saved!");
  });
})