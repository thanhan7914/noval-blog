// class A {
//     static get __dependencies() {
//         return {
//              constructor: ['./a', './b']
//         };
//     }
// }
const path = require('path');
const utils = require('./utils');
const factory = require('./factory');

function join(dir, file) {
    return path.join(dir, file).replace(/\\/g, '/');
}

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

class DIContainer {
    constructor(root) {
        this.root = root;
        this.modules = {};
    }

    require(type) {
        return require(path.join(this.root, type));
    }

    get(name) {
        name = lowerCase(toJsFileName(name));

        if(this.modules.hasOwnProperty(name))
            return this.modules[name];

        return null;
    }

    resolve(type) {
        let m = null;

        if(typeof type === 'string' && (m = this.get(type)) !== null)
        {}
        else {
            for(let type in this.modules)
                if(this.modules[type].constructor === type)
                {
                    m = this.modules[type];
                    break;
                }
        }

        if(m == null) return null;

        if(typeof m.constructor !== 'function')
            return m.constructor;

        let deps_instance = [];
        for(let d of m.dependencies)
            deps_instance.push(this.resolve(d));

        // return new m.constructor(...deps_instance);
        return factory(m.constructor, deps_instance);
    }

    store(type, value) {
        type = lowerCase(toJsFileName(type));
        if(this.modules.hasOwnProperty(type)) return type;

        let deps = [];

        if(typeof value.__dependencies == 'object' && 
             typeof value.__dependencies.constructor == 'object' &&
             value.__dependencies.constructor instanceof Array)
        {
            for(let d of value.__dependencies.constructor)
            {
                if(typeof d == 'string')
                    deps.push(this.store(d, this.require(lowerCase(toJsFileName(d)))));
                else if(typeof d == 'object')
                    deps.push(this.store(d.type, utils.orDefault(d.module, utils.defaultValue(d.type))));
            }
        }

        this.modules[type] = {
            constructor: value,
            dependencies: deps
        };

        return type;
    }

    resolveAndCreate(modules) {
        //modules => {type, module}
        for(let m of modules)
        {
            if(typeof m == 'string')
                this.store(m, this.require(m));
            else
                this.store(m.type, m.module);
        }
    }

    resolveParameters(type, fname, dir = '') {
        let m = this.get(type).constructor;
        
        if(m === null)
            return [];
    
        if(typeof m.__dependencies === 'undefined' ||
            typeof m.__dependencies[fname] === 'undefined')
            return [];
        
        return m.__dependencies[fname].map(d => {
            if(typeof d === 'string')
            {
                if(!d.startsWith(dir)) d = join(dir, d);
                return this.resolve(d);
            }

            return this.resolve(d);
        });
    }    
}

module.exports = DIContainer;
