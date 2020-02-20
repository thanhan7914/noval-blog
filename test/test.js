const root = 'app/';

const DIContainer = require('../lib/index');
const PureRequest = require('../lib/base/request');

console.log(DIContainer);
let h = DIContainer.resolve('app/http/controllers/HomeController');
const HomeController = require('../app/http/controllers/home-controller');
console.log(h instanceof HomeController);

console.log(require('../lib/config')('app.port'))
console.log(require('../lib/config')('plugin.express-session'));


const { trans, getLocale } = require('../lib/lang');
console.log(trans('message.error_404'));
console.log(getLocale())
