const Model = require('../lib/base/model');

class Phone extends Model {
    static get __primaryKey() {
        return 'user_id';
    }
}

Phone.initialize();

class Address extends Model {
    user() {
        return this.belongsTo(User);
    }
}

Address.initialize();

class Tag extends Model {
    users() {
        return this.belongsToMany(User, 'user_tag');
    }
}

class User extends Model {
    static get fillable() {
        return ['user'];
    }

    phones() {
        return this.hasOne(Phone, 'id', 'user_id');
    }

    addresses() {
        return this.hasMany(Address);
    }

    tags() {
        return this.belongsToMany(Tag, 'user_tag');
    }
}

User.initialize();

(async function() {
    let user = await User.find(2);
    
    // console.log(user);
    let address = await Address.find(8);
    address.user().then(console.log);
    let t = await Tag.find(2);
    // await user.tags().attach([2, 3, 5]);
    // await user.tags().detach([2, 3]);
    // user.tags().attach([6]).then(console.log);
    user.tags().detach(6);
    // await user.tags().attach(t, {
    //     detail: 'xxx'
    // });
    // user.password = 'conx';
    // user.tags().collection.then(async (tags) => {
    //     console.log(tags);
    // });
    // await user.tags().detachAll();
    console.log(user.tags());
    
    
    // // // let c = user.phones();
    // // console.log(user.addresses());
    // let a = new Address({
    //     address: '12 aghska'
    // });

    // await user.addresses().save(a);
    // await user.save();
    // console.log(user);
    // await user.del();
})();
