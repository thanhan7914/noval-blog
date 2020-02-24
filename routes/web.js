const router = require('../lib/base/router')();
const middleware = require('../lib/middleware');

middleware(router, 'web');

router.get('/', {types: {page: 'number'}}, 'HomeController@index');
router.get('/article/:slug', 'HomeController@article');
router.get('/about', function(req, res) {res.render('about');});

router.get('/admin/login', function(req, res) {
    res.render('admin/login');
});
router.get('/admin/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});
router.post('/admin/login', 'Auth/LoginController@index');


router.group('/admin', {
    middleware: ['app/http/middleware/CheckIfAdmin']
}, require('./admin'));

module.exports = router.ExpressRouter;
