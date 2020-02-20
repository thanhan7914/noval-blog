class Middleware {
    handle(req, res, next) {
        next();
    }
}

module.exports = Middleware;
