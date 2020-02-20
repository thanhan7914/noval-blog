class ValidationError extends Error {
    constructor (errors, ...oths) {
        super(...oths);

        this.errors = errors;
        this.name = 'ValidationError';
        this.message = 'An error occurred while validating input parameters';
    }

    getErrors() {
        return this.errors;
    }
}

module.exports = ValidationError;
