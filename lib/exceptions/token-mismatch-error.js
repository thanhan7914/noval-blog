class TokenMismatchError extends Error {
    constructor (...oths) {
        super(...oths);
        this.name = 'TokenMismatchError';
    }
}

module.exports = TokenMismatchError;
