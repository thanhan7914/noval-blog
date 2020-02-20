const utils = require('./utils');
const Request = require('./base/request');

module.exports = function(constructor, dependencies) {
    if(utils.getBaseClass(constructor) === Request)
        return utils.createProxyInstance(
            new constructor(...dependencies),
            'req'
        );

    return new constructor(...dependencies);
};
