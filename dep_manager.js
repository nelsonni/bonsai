// recursively read and filter all files below the specified directory
// use callback to handle each result, or collect to work with all results
function fromDir(startPath, filter, callback){
  let fs = require('fs');
  let path = require('path');
  if (!fs.existsSync(startPath)){
    console.log("no dir: ",startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  for(var i = 0; i < files.length; i++){
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      fromDir(filename, filter, callback); //recurse
    }
    else if (filename.indexOf(filter) >= 0) callback(filename);
  };
};

function getFileExt(file) {
  let path = require('path');
  return path.extname(file);
}

function loadLibs() {

}
