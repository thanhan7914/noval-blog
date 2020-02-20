const Controller = require('../../../lib/base/controller');

class HomeController extends Controller {
    static get __dependencies() {
        return {
            constructor: ['app/services/HomeService'],
            index: []
        }
    }

    constructor(homeService) {
        super();
        this.homeService = homeService;
    }

    index(req, res) {
        let result = this.homeService.handle(req);
        res.json(result);
    }
}

module.exports = HomeController;
