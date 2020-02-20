class MethodNotFoundError extends Error {
    constructor(...oths) {
        super(...oths);
        this.name = 'MethodNotFoundError';
    }
}

module.exports = MethodNotFoundError;
