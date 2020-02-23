const Model = require('../../lib/base/model');

class Category extends Model {
    get href() {
        return '/category/' + this.slug;
    }
}

Category.initialize();
module.exports = Category;
