module.exports = function(app) {
    app.use(function(req, res, next) {
        require('./request')(req, res);
        require('./response')(req, res);

        next();
    });
};
