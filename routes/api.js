const router = require('../lib/base/router')();
const middleware = require('../lib/middleware');

middleware(router, 'api');

router.get('/', function(req, res) {
    res.json({status: 200});
});

module.exports = router.ExpressRouter;
