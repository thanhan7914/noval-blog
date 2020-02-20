const HttpError = require('./http-error');

class AccessDeniedHttpError extends HttpError {
    constructor(...oths) {
        super(401, ...oths);

        this.name = 'AccessDeniedHttpError';
    }
}

module.exports = AccessDeniedHttpError;
