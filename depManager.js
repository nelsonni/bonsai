function preload(dom) {
  // load external libraries
  // loadLibs(dom);

  // dynamically load all CSS files
  fromDir('css', '.css', (filename) => loadCSS(dom, filename));

  // dynamically load all JS files
  fromDir('js', '.js', (filename) => loadJS(dom, filename));
}

function loadCSS(dom, filename) {
  let ref = document.createElement('link');
  ref.setAttribute('rel', 'stylesheet');
  ref.setAttribute('type', 'text/css');
  ref.setAttribute('href', filename);
  console.log('loadCSS -> ' + filename);
  dom.appendChild(ref);
}

function loadJS(dom, filename) {
  let ref = document.createElement('script');
  ref.setAttribute('type', 'text/javascript');
  ref.setAttribute('src', filename);
  console.log('loadJS -> ' + filename);
  dom.appendChild(ref);
}

function loadLibs(dom) {
  // Stylesheets for all libraries
  loadCSS(dom, 'libs/jquery/jquery-ui.css');
  loadCSS(dom, 'libs/slick/slick.css');
  loadCSS(dom, 'libs/slick/slick-theme.css');

  // JQuery and JQuery UI libraries
  loadJS(dom, 'libs/jquery/jquery.min.js');
  loadJS(dom, 'libs/jquery/jquery-ui.js');

  // slick.js library
  loadJS(dom, 'libs/slick/slick.min.js');

  // Raphael.js library
  loadJS(dom, 'libs/sketching/raphael.min.js');
  loadJS(dom, 'libs/sketching/raphael.sketchpad.js');

  // AceEditor library
  loadJS(dom, 'libs/ace/ace.js');
  loadJS(dom, 'libs/ace/ext-modelist.js');
}

// recursively read and filter all files below the specified directory
// use callback to handle each result, or collect to work with all results
function fromDir(startPath, filter, callback) {
  let fs = require('fs');
  let path = require('path');
  if (!fs.existsSync(startPath)) {
    console.log('no dir: ', startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter, callback); //recurse
    } else if (filename.indexOf(filter) >= 0) callback(filename);
  };
};

function getFileExt(file) {
  let path = require('path');
  return path.extname(file);
}
