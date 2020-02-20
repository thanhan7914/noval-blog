class Validator {
    constructor() {
        this.name = 'validator';
    }

    validate() {
        return {
            passed: true,
            message: 'success'
        };
    }
}

module.exports = Validator;
