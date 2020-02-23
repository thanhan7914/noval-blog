const Controller = require('../../../../lib/base/controller');
const Tag = require('../../../models/tag');
const Category = require('../../../models/category');
const User = require('../../../models/user');
const Post = require('../../../models/post');
const slug = require('../../../../commons/slug');
const util = require('../../../../lib/utils');

const MAX_PAGES = 80;

class PostController extends Controller {
    static get __dependencies() {
        return {
            constructor: [],
            store: [
                'app/http/requests/admin/CreatePostRequest'
            ],
            update: [
                'app/http/requests/admin/CreatePostRequest'
            ]
        }
    }

    constructor () {
        super()
    }

    async index(req, res) {
        let page = req.get("page") ? req.get("page") : 1;
        if (page < 1) page = 1;
        let skip = (page - 1) * 10;
        let result = await Post
            .offset(skip)
            .limit(10)
            .orderBy("created_at", "desc")
            .getData();

        let count = (await Post.count('* as count').first()).count;
        let pages = Math.ceil(count / 10);
        pages = pages > MAX_PAGES ? MAX_PAGES : pages;
        let numbers = [];
        for(let i = 1; i <= pages; i++){if(!(i > 1 && i < pages && Math.abs(i - page) > 2)) numbers.push(i)}

        res.render('admin/post/index', {
            posts: result,
            count: count,
            pages: pages,
            page: page,
            numbers: numbers
        });
    }

    async store(req, res) {
        let admin = await User.find(1);
        let post = new Post(req.only(['title', 'content', 'description', 'cover']));
        post.slug = slug(req.get('title').trim());
        post.publication = true;
        await admin.getPost().save(post);

        let categories = req.get('categories').map(r => Number(r));
        await post.getCategory().attach(categories);

        let tags = req.get('tags') ? req.get('tags') : [];
        let tagsid = [];
        for(let name of tags)
        {
            let tmp = await Tag.findOne({name: name});
            if(tmp == null)
                tmp = await Tag.create({name: name, slug: slug(name)});
            
            tagsid.push(tmp.primaryValue);
        }

        await post.getTag().attach(tagsid);

        res.redirect('/admin/post');
    }

    async create(req, res) {
        let tags = await Tag.getData();
        let categories = await Category.getData();

        res.render('admin/post/create_post', {
            tags,
            categories,
            isEdited: false
        });
    }

    async edit(req, res) {
        let article = await Post.find(req.params.article);
        if(article == null)
            return res.redirect('/admin/post');

        let tags = await Tag.getData();
        let categories = await Category.getData();

        res.render('admin/post/create_post', {
            tags,
            categories,
            isEdited: true,
            article: article
        });
    }

    async update(req, res) {
        let post = await Post.find(req.params.article);
        if(post == null)
            return res.redirect('/admin/post');

        util.cloneWith(req.all(), post, ['title', 'description', 'content', 'cover']);

        await Promise.all([
            post.save(),
            post.getCategory().detachAll(),
            post.getTag().detachAll()
        ]);

        let categories = req.get('categories').map(r => Number(r));
        await post.getCategory().attach(categories);

        let tags = req.get('tags') ? req.get('tags') : [];
        let tagsid = [];
        for(let name of tags)
        {
            let tmp = await Tag.findOne({name: name});
            if(tmp == null)
                tmp = await Tag.create({name: name, slug: slug(name)});
            
            tagsid.push(tmp.primaryValue);
        }

        await post.getTag().attach(tagsid);

        res.redirect('/admin/post');
    }

    async destroyConfirm(req, res) {
        res.render('admin/post/destroy', {id: req.params.article});
    }

    async destroy(req, res) {
        let post = await Post.find(req.params.article);
        if(post == null)
            return res.redirect('/admin/post');

        await post.del();
        res.redirect('/admin/post');
    }
}

module.exports = PostController;
