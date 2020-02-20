const _ = require('lodash');

function response(passed, message = 'invalid') {
    return {
        passed,
        message
    };
}

module.exports = {
    'required': function (value) {
        return response(!_.isNull(value) && !_.isUndefined(value));
    },
    'nullable': function (value) {
        return response(true);
    },
    'notnull': function (value) {
        return response(!_.isNil(value) && _.isString(value) && value.trim() !== '');
    },
    'string': function (value) {
        return response(_.isString(value) || _.isNumber(value));
    },
    'number': function (value) {
        return response(_.isNumber(value) && value === value);
    },
    'boolean': function (value) {
        return response(_.isBoolean(value));
    },
    'array': function (value) {
        return response(_.isArray(value));
    },
    'max': function (value, len) {
        if(_.isNumber(value)) return response(value <= len);
        return response(value.length <= len);
    },
    'min': function (value, len) {
        if(_.isNumber(value)) return response(value >= len);
        return response(value.length >= len);
    },
    'email': function (value) {
        return response(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value));
    }
};
