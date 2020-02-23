const Model = require('../../lib/base/model');

class User extends Model {
    getPost() {
        return this.hasMany(require("./post"), 'id', 'user_id');
    }
}

User.initialize();
module.exports = User;
