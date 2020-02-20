const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const baseFolder = path.join(__dirname, '/base');
const templateFolder = path.join(__dirname, '/template');
const controllerFolder = path.join(__dirname, '../app/http/controllers');
const requestFolder = path.join(__dirname, '../app/http/requests');
const middlewareFolder = path.join(__dirname, '../app/http/middleware');
const modelFolder = path.join(__dirname, '../app/models');
const validatorFolder = path.join(__dirname, '../app/validator');
const serviceFolder = path.join(__dirname, '../app/services');

function lowerCase(x) {
    if(typeof x === 'string' || typeof x === 'number')
        return String(x).toLowerCase(x);
    else return x;
}

function toJsFileName(x) {
    let chars = [], code, s = false;
    for(let i = 0; i < x.length; i++)
    {
        code = x.charCodeAt(i);
        if(code >= 65 && code <= 90)
            chars.push((s ? '-' : '' ) + String.fromCharCode(code + 32));
        else 
            chars.push(x[i]);

        s = (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
    }

    return chars.join('');
}

function createFolder (root, target) {
    let folders = [];

    while(path.relative(root, target) !== '')
    {
        if(fs.existsSync(target))
            break;
        
        folders.push(path.basename(target));
        target = path.dirname(target);
    }
    
    folders.reverse();

    for(let i = 0; i < folders.length; i++)
        fs.mkdirSync(path.join(root, folders.slice(0, i + 1).join('/')));
}

function readAndBind(file, data) {
    let content = fs.readFileSync(file, { encoding: 'utf8' });

    try {
        let text = '`' + content + '`';
        
        return eval(`
            let data = ${JSON.stringify(data)};
            let text = ${text};
            text
        `);
    }
    catch{ return content; }
}

function createClass(root, baseClass, className) {
    let file = path.join(root, className);
    let folder = path.dirname(file);

    if(!file.endsWith('.js')) file += '.js';

    let fileContent = readAndBind(path.join(templateFolder, baseClass), {
        lib: utils.relative(folder, __dirname),
        path: utils.join(path.relative(folder, baseFolder), baseClass),
        name: path.basename(file, '.js')
    });

    createFolder(root, lowerCase(toJsFileName(folder)));

    file = path.join(path.dirname(file), lowerCase(toJsFileName(path.basename(file, '.js'))) + '.js');

    fs.writeFileSync(file, fileContent, {
        encoding: 'utf8'
    });

    console.log('created class ' + file + '');
}

function make(type, ...oths) {
    if(oths.length === 0) return;

    switch(type) {
        case 'controller':
            {
                createClass(controllerFolder, 'controller', oths[0]);
            }
            break;
        case 'request':
            {
                createClass(requestFolder, 'request', oths[0]);
            }
            break;
        case 'validator':
            {
                createClass(validatorFolder, 'validator', oths[0]);
            }
            break;
        case 'middleware':
            {
                createClass(middlewareFolder, 'middleware', oths[0]);
            }
            break;
        case 'service':
            {
                createClass(serviceFolder, 'service', oths[0]);
            }
            break;
        case 'model':
            {
                createClass(modelFolder, 'model', oths[0]);
            }
            break;
    }
}

module.exports = function (args) {
    if(args.length === 0) return;

    let cmd = args[0];

    switch(true) {
        case cmd.startsWith('make:'):
            {
                make(cmd.split(':')[1], ...args.slice(1));
            }
            break;
    }
};
