const Request = require('../../../lib/base/request');

class LoginRequest extends Request {
    auth() {
        return true;
    }

    rules() {
        return {
            email: 'required|email',
            password: 'requried|string|min:8|max:25'
        };
    }

    messages() {
        return {
            email: {
                'email': 'Invalid email address'
            },
            password: {
                'min:8': 'Your password must be between 8 and 25 characters',
                'max:25': 'Your password must be between 8 and 25 characters'
            }
        }
    }
}

module.exports = LoginRequest;
