const Controller = require('../../../../lib/base/controller');
const Category = require('../../../models/category');
const slug = require('../../../../commons/slug');

class CategoryController extends Controller {
    static get __dependencies() {
        return {
            constructor: [],
            store: [
                'app/http/requests/admin/CreateCategoryRequest'
            ],
            update: [
                'app/http/requests/admin/CreateCategoryRequest'
            ]
        }
    }

    constructor () {
        super()
    }

    async index(req, res) {
        let categories = await Category.getData();

        res.render('admin/categories/index', {categories});
    }

    async store(req, res) {
        await Category.create({
            name: req.get('name'),
            slug: slug(req.get('name'))
        });

        res.redirect('/admin/category');
    }

    async update(req, res) {
        let category = await Category.find(req.params.catid);
        if(category == null)
            return res.redirect('/admin/category');

        category.name = req.get('name');
        await category.save();
        res.redirect('/admin/category');
    }

    async destroy(req, res) {
        await Category.where('id', req.params.catid)
            .del();

        res.redirect('/admin/category');
    }
}

module.exports = CategoryController;
