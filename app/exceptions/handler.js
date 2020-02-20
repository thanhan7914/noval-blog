const HttpError = require('../../lib/exceptions/http-error');
const NotFoundHttpError = require('../../lib/exceptions/not-found-http-error');
const AccessDeniedHttpError = require('../../lib/exceptions/access-denied-http-error');

class Handler {
    render(error, request, response) {
        response.status(error.statusCode ? error.statusCode : 404);

        console.log(error);
        switch(true)
        {
            case error instanceof AccessDeniedHttpError:
                return response.render('errors/403');
            case error instanceof NotFoundHttpError:
                return response.render('errors/404');
        }

        response.render('errors/404');
    }
}

module.exports = Handler;
