const Validator = require('../../lib/base/validator');

class EmailValidator extends Validator {
    validate(value) {
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
            return {
                passed: true,
                message: 'success'
            };
        
        return {
            passed: false,
            message: 'invalid'
        };
    }
}

module.exports = EmailValidator;
