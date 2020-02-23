const Middleware = require("../../../lib/base/middleware");

class CheckIfAdmin extends Middleware {
    handle(req, res, next) {
        if (req.session.email) return next();

        res.redirect("/admin/login");
    }
}

module.exports = CheckIfAdmin;
