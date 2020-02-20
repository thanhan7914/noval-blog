const utils = require('./utils');
const path = require('path');

function load(root) {
    let storage = [];
    let files = utils.getFileList(path.join(__dirname, root), '.json');

    for(let file of files)
        storage.push({
            key: utils.relative(root, file).replace(/\//g, '.'),
            data: require(file + '.json')
        });

    return function trans(key) {
        let pos = key.lastIndexOf('.');
        let file = key;
        if(pos !== -1)
        {
            file = key.substring(0, pos);
            key = key.substring(pos + 1);
        }

        for(let c of storage)
            if(c.key == file)
                return c.data[key];
        
        if(file.indexOf('.') == -1)
            return null;
        else {
            let obj = trans(file);
            if(obj == null) return null;
            if(obj.hasOwnProperty(key))
                return obj[key];
        }
    };
}

module.exports = load;
