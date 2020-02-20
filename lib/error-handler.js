const DIContainer = require('./index');
const NotFoundHttpError = require('./exceptions/not-found-http-error');
const TokenMismatchError = require('./exceptions/token-mismatch-error');

module.exports = function(error, req, res) {
    let handler = DIContainer.resolve('app/exceptions/handler');
    
    if(!error) error = new NotFoundHttpError();
    if(error.code && error.code === 'EBADCSRFTOKEN')
        error = new TokenMismatchError();

    handler.render(error, req, res);
};
