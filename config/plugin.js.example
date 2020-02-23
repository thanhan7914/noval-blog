module.exports = {
    formidable: {
        encoding: 'utf-8',
        multiples: true
    },
    'express-session': {
        secret: 'a secret key',
        saveUninitialized: true,
        resave: true,
        cookie: {
            maxAge: 259200000
        }
    },
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    },
    csrf: {
        cookie: true
    }
};
