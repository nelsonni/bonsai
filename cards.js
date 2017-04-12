var remote = require('remote');
var dialog = remote.require('dialog');

function openFile() {
    dialog.showOpenDialog(function(fileNames) {

    });
}

function versionNotice() {
    console.log(dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory', 'multiSelections']
    }));
}
