const Controller = require('../../../../lib/base/controller');

class DashboardController extends Controller {
    static get __dependencies() {
        return {
            constructor: []
        }
    }

    constructor () {
        super()
    }

    dashboard(req, res) {
        res.render('admin/dashboard');
    }
}

module.exports = DashboardController;
