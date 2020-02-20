const _ = require('lodash');
const utils = require('../utils');

class Storage extends Array {
    get() {
        return _.merge({}, ...this);
    }
}

module.exports = function(req) {
    if(!_.isUndefined(req.session.errors))
    {
        req.errors = req.session.errors;
        delete req.session.errors;
    }

    if(!_.isUndefined(req.session.inputData))
    {
        req.oldInputData = req.session.inputData;
        req.old = function(name) {
            if(_.isUndefined(req.oldInputData[name]))
                return null;
            return req.oldInputData[name];
        };

        delete req.session.inputData;
    }

    let fields = _.mapValues(_.merge({}, req.query, _.isUndefined(req.body) ? {} : req.body,
        _.isUndefined(req.fields) ? {} : req.fields, _.isUndefined(req.files) ? {} : req.files), function(v) {
        return utils.parse(v);
    });

    req.body = req.fields;

    req.getInput = function(name) {
        if(_.isUndefined(fields[name]))
            return null;

        return fields[name];
    }

    let storage = new Storage();

    req.transport = function(data) {
        storage.push(data);
    }

    Object.defineProperty(req, 'package', {
        get: function() {
            return storage.get();
        }
    });
};
