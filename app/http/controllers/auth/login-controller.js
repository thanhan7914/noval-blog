const Controller = require('../../../../lib/base/controller');
const crypto = require('../../../../commons/crypto');
const User = require('../../../models/user');

class LoginController extends Controller {
    static get __dependencies() {
        return {
            constructor: [],
            index: ['app/http/requests/LoginRequest']
        }
    }

    constructor () {
        super()
    }

    async index(req, res) {
        let password_hash = crypto.createHash(req.get('password') + ',' + req.get('email'));
        let account = await User.where('email', req.get('email'))
            .andWhere('password', password_hash)
            .first()
            .getData();

        if(account !== null && !account.is_blocked)
        {
            req.session.email = account.email;
            req.session.password = account.password;
            return res.redirect('/admin/dashboard');
        }

        res.redirect('/admin/login');
    }
}

module.exports = LoginController;
