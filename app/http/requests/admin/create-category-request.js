const Request = require('../../../../lib/base/request');

class CreateCategoryRequest extends Request {
    auth() {
        return true;
    }

    rules() {
        return {
            name: 'string|notnull|min:3|max:50'
        };
    }
}

module.exports = CreateCategoryRequest;
