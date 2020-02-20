const path = require('path');
const root = '../';
const DIContainer = require('./dicontainer');
const ignore = require('./config')('app.bsignore');
const utils = require('./utils');
let instance = new DIContainer(root);
let files = utils.getFileList(path.join(__dirname, root, 'app'));

function inIgnore(filePath) {
    for(let ig of ignore)
        if(filePath.startsWith(ig))
            return true;
    
    return false;
    // return ignore.indexOf(filePath) !== -1;
}

instance.resolveAndCreate(files.map(f => utils.relative(root, f)).filter(f => !inIgnore(f)));

module.exports = instance;
