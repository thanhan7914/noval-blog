const router = require('../lib/base/router')();
const middleware = require('../lib/middleware');

middleware(router, 'web');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/test', {
    validator: {
        'q': 'string|min:1|email2'
    }
}, function(req, res) {
    res.render('index');
});

module.exports = router.ExpressRouter;
