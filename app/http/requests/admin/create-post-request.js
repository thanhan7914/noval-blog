const Request = require('../../../../lib/base/request');

class CreatePostRequest extends Request {
    auth() {
        return true;
    }

    rules() {
        return {
            categories: 'array',
            title: 'string|notnull',
            description: 'string|notnull',
            content: 'required|notnull'
        };
    }

    types() {
        return {
            categories: 'array',
            tags: 'array'
        };
    }
}

module.exports = CreatePostRequest;
