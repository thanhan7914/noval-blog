const Controller = require("../../../lib/base/controller");
const Post = require("../../models/post");
const Category = require("../../models/category");
const User = require("../../models/user");

const MAX_PAGES = 80;

class HomeController extends Controller {
    static get __dependencies() {
        return {
            constructor: ["app/services/HomeService"],
            index: []
        };
    }

    constructor(homeService) {
        super();
        this.homeService = homeService;
    }

    async index(req, res) {
        let page = req.get("page") ? req.get("page") : 1;
        if (page < 1) page = 1;
        let skip = (page - 1) * 10;
        let result = await Post.where("publication", true)
            .offset(skip)
            .limit(10)
            .orderBy("created_at", "desc")
            .getData();

        let count = (await Post.count("* as count").first()).count;
        let pages = Math.ceil(count / 10);
        pages = pages > MAX_PAGES ? MAX_PAGES : pages;
        let numbers = [];
        for (let i = 1; i <= pages; i++) {
            if (!(i > 1 && i < pages && Math.abs(i - page) > 2))
                numbers.push(i);
        }

        res.render("index", {
            posts: result,
            count: count,
            pages: pages,
            page: page,
            numbers: numbers
        });
    }

    async article(req, res) {
        let article = await Post.findOne({ slug: req.params.slug });
        if (article == null) return res.redirect("/");
        res.render("single", { article });
    }

    async category(req ,res) {
        let page = req.get("page") ? req.get("page") : 1;
        if (page < 1) page = 1;
        let skip = (page - 1) * 10;
        let result = await Post
            .join('post_category', 'posts.id', '=', 'post_category.post_id')
            .join('categories', 'post_category.cat_id', '=', 'categories.id')
            .where("posts.publication", true)
            .where("categories.slug", req.params.slug)
            .offset(skip)
            .limit(10)
            .orderBy("posts.created_at", "desc")
            .getData(Post);

        let count = (await Post.count("* as count").first()).count;
        let pages = Math.ceil(count / 10);
        pages = pages > MAX_PAGES ? MAX_PAGES : pages;
        let numbers = [];
        for (let i = 1; i <= pages; i++) {
            if (!(i > 1 && i < pages && Math.abs(i - page) > 2))
                numbers.push(i);
        }

        res.render("index", {
            posts: result,
            count: count,
            pages: pages,
            page: page,
            numbers: numbers
        });
    }
}

module.exports = HomeController;
