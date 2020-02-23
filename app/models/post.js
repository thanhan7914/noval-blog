const Model = require("../../lib/base/model");
const Category = require("./category");
const Comment = require("./comment");
const Tag = require("./tag");
const User = require("./user");

class Post extends Model {
    getUser() {
        return this.hasOne(User, "user_id", "id");
    }

    getCategory() {
        return this.belongsToMany(
            Category,
            "post_category",
            "cat_id",
            "post_id"
        );
    }

    getTag() {
        return this.belongsToMany(Tag, "post_tag", "tag_id", "post_id");
    }

    getComment() {
        return this.hasMany(Comment);
    }

    async populate() {
        this.user = await this.getUser().instance;
        this.comments = await this.getComment().collection();
        this.categories = await this.getCategory().collection();
        this.tags = await this.getTag().collection();
    }

    get shortContent() {
        return this.description.substring(0, 128);
    }

    get href() {
        return '/article/' + this.slug;
    }

    get coverImage() {
        if(this.cover === '')
            return '/images/image_1.jpg';

        return this.cover;
    }
}

Post.initialize();
module.exports = Post;
