const express = require('express');
const config = require('../lib/config');
const path = require('path');
const favicon = require('serve-favicon')
const session = require('express-session')
const formidableMiddleware = require('express-formidable');
const errorHandler = require('./error-handler');
const port = process.env.PORT || config('app.port');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();

module.exports = function (injection) {
    app.set('views', path.join(__dirname, '../resources/', 'views'));
    app.set('view engine', 'pug');

    app.use(cors(config('plugin.cors')));
    app.use(formidableMiddleware(config('plugin.formidable')));
    app.use(session(config('plugin.express-session')));
    app.use(cookieParser());

    app.use('/css', express.static(__dirname + '/../assets/css'));
    app.use('/fonts', express.static(__dirname + '/../assets/fonts'));
    app.use('/images', express.static(__dirname + '/../assets/images'));
    app.use('/js', express.static(__dirname + '/../assets/js'));
    app.use('/scss', express.static(__dirname + '/../assets/scss'));
    app.use(favicon(__dirname + '/../assets/images/favicon.ico'));

    if(typeof injection === 'function')
        injection(app);

    require('../lib/hook')(app);
    require('../lib/middleware')(app);

    app.use('/api', require('../routes/api'));
    app.use(csrf(config('plugin.csrf')));
    app.use('/', require('../routes/web'));

    app.use(function (error, req, res, next) {
        errorHandler(error, req, res);
    });
    app.use(function(req, res, next) {
        errorHandler(null, req, res);
    });

    app.listen(port, () => console.log(`Application listening on port ${port}!`));
};
