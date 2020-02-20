const HttpError = require('./http-error');

class NotFoundHttpError extends HttpError {
    constructor(...oths) {
        super(404, ...oths);

        this.name = 'NotFoundHttpError';
    }
}

module.exports = NotFoundHttpError;
