const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = {
    deepclone: function(a, b, c) {
        if (!(c instanceof Array)) c = [];
        for (let i in a)
            if (a.hasOwnProperty(i) && c.indexOf(i.toString()) === -1) {
                if (a[i] instanceof Array) b[i] = a[i];
                else if (typeof a[i] === 'object') {
                    if (!b.hasOwnProperty(i)) b[i] = {};
                    this.deepclone(a[i], b[i]);
                } else b[i] = a[i];
            }
    },
    cloneWith: function(a, b, c) {
        if (!(c instanceof Array)) c = [];
        for (let i of c)
            if (typeof a[i] !== 'undefined') b[i] = a[i];
    },
    cloneWithout: function(a, b, c) {
        if (!(c instanceof Array)) c = [];
        for (let i in a)
            if (a.hasOwnProperty(i) && c.indexOf(i.toString()) === -1) b[i] = a[i];
    },
    hasattr: function(obj, attr) {
        if (typeof obj['hasOwnProperty'] === 'undefined') throw '##obj has not attribute hasOwnProperty.';
        if (typeof attr === 'string') return obj.hasOwnProperty(attr);
        if (attr instanceof Array) {
            let un = true;
            for (let i of attr)
                if (!(un = obj.hasOwnProperty(i))) break;

            return un;
        }

        throw 'variable ##attr invalid';
    },
    defaultValue: function(type) {
        switch(type) {
            case 'string': return '';
            case 'number': return 0;
            case 'boolean': return false;
            default: return null;
        }
    },
    orDefault: function(value, d = this.defaultValue(value)) {
        return (typeof value == 'undefined' ? d : value);
    },
    convert: function(value, type) {
        switch(type) {
            case 'number': return Number(value);
            case 'boolean': return Boolean(value);
            case 'string': return String(value);
            case 'array': {
                try {
                    if(_.isArray(value))
                        return value;
                    let t = JSON.parse(value);
                    if(_.isArray(t))
                        return t;
                    return [value];
                }
                catch(err) {return [value];}
            }
            case 'object': return JSON.parse(value);
            default: return value;
        }
    },
    parse: function(value) {
        try {
            if(/(^(0+)[0-9]+)/.test(value)) return value;
            return JSON.parse(value);
        }
        catch {return value;}
    },
    join: function (dir, file) {
        return path.join(dir, file).replace(/\\/g, '/');
    },
    relative: function (dir, file) {
        return path.relative(dir, file).replace(/\\/g, '/');
    },
    getFileList: function(directoryPath, ext = '.js') {
        let files = [];
        let result = fs.readdirSync(directoryPath);
        let tmp;
    
        for(let file of result)
        {
            tmp = path.join(directoryPath, file);
            if(fs.lstatSync(tmp).isDirectory())
                files = files.concat(this.getFileList(tmp, ext));
            else
            {
                if(tmp.endsWith(ext))
                {
                    tmp = tmp.substring(0, tmp.length - ext.length);
                    files.push(this.relative(__dirname, tmp));
                }
            }
        }
    
        return files;
    },
    createProxyInstance: function(instance, attribute, getter = true, setter = false) {
        let validator = {};

        if(getter)
            Object.assign(validator, {
                get: function(obj, prop) {
                    return prop in obj ?
                        obj[prop] : obj[attribute][prop];
                }
            });

        if(setter)
            Object.assign(validator, {
                set: function(obj, prop, value) {
                    if(prop in obj)
                        obj[prop] = value;
                    else
                        obj[attribute][prop] = value;

                    return true;
                }
            });
        
        return new Proxy(instance, validator);
    },
    //https://stackoverflow.com/questions/31644662/get-parent-class-name-from-child-with-es6
    getBaseClass: function(targetClass) {
        if (targetClass instanceof Function) {
            let baseClass = targetClass;
    
            while (baseClass) {
                const newBaseClass = Object.getPrototypeOf(baseClass);
    
                if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
                    baseClass = newBaseClass;
                } else {
                    break;
                }
            }
    
            return baseClass;
        }
    }
};
