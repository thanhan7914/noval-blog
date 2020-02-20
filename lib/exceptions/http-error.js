class HttpError extends Error {
    constructor (statusCode, ...oths) {
        super(...oths);

        this.statusCode = statusCode;
        this.name = 'HttpError';
    }
}

module.exports = HttpError;
