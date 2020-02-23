const Builder = require('knex/lib/query/builder');
const db = require('../db');
const pluralize = require('pluralize');
const _ = require('lodash');
const DIContainer = require('../index');
const Collection = require('./collection');

function underscore(name) {
    return name.replace(/(?:^|\.?)([A-Z])/g, function (x,y){
        return '_' + y.toLowerCase()
    }).replace(/^_/, '');
}

function toTableName(name) {
    return underscore(pluralize(name));
}

Builder.prototype.getData = function(className) {
    return this.then(async (rows) => {
        let primary = className.__primaryKey;

        if(_.isArray(rows))
        {
            if(rows.length === 0) return new Collection;

            let collections = new Collection;
            let columns = _.keys(rows[0]);
            if(columns.indexOf(primary) === -1)
            {
                columns.push(className.__primaryKey);
            
                return this.select(columns)
                .then(async r => {
                    for(let row of r)
                    {
                        let isn = new className(true, row);
                        await isn.populate();
                        collections.push(isn);
                    }

                        return collections;
                });    
            }
            
            for(let row of rows)
            {
                let isn = new className(true, row);
                await isn.populate();
                collections.push(isn);
            }

            return collections;
        }

        if(!_.isUndefined(rows))
        {
            if(_.isUndefined(rows[primary]))
                rows[primary] = (await this.select(primary))[primary];

            let isn = new className(true, rows);
            await isn.populate();
            return isn;
        }

        return Promise.resolve(null);
    });
}

let funcs = ['toSQL','clone','timeout','with','withWrapped','withRecursive','withRecursiveWrapped','columns','as','withSchema','table','distinct','distinctOn','join','innerJoin','leftJoin','leftOuterJoin','rightJoin','rightOuterJoin','outerJoin','fullOuterJoin','crossJoin','joinRaw','where','whereColumn','orWhere','orWhereColumn','whereNot','whereNotColumn','orWhereNot','orWhereNotColumn','_objectWhere','whereRaw','orWhereRaw','whereWrapped','whereExists','orWhereExists','whereNotExists','orWhereNotExists','whereIn','orWhereIn','whereNotIn','orWhereNotIn','whereNull','orWhereNull','whereNotNull','orWhereNotNull','whereBetween','whereNotBetween','orWhereBetween','orWhereNotBetween','groupBy','groupByRaw','orderBy','_orderByArray','orderByRaw','_union','union','unionAll','intersect','having','orHaving','havingWrapped','havingNull','orHavingNull','havingNotNull','orHavingNotNull','havingExists','orHavingExists','havingNotExists','orHavingNotExists','havingBetween','orHavingBetween','havingNotBetween','orHavingNotBetween','havingIn','orHavingIn','havingNotIn','orHavingNotIn','havingRaw','orHavingRaw','offset','limit','count','min','max','sum','avg','countDistinct','sumDistinct','avgDistinct','increment','decrement','clearCounters','first','connection','pluck','clearSelect','clearWhere','clearOrder','clearHaving','insert','update','returning','delete','truncate','columnInfo','forUpdate','forShare','skipLocked','noWait','fromJS','modify','_counter','_bool','_not','_joinType','_aggregate','_clearGrouping','_isSelectQuery','_hasLockMode','select','column','andWhereNot','andWhereNotColumn','andWhere','andWhereColumn','andWhereRaw','andWhereBetween','andWhereNotBetween','andHaving','andHavingIn','andHavingNotIn','andHavingNull','andHavingNotNull','andHavingExists','andHavingNotExists','andHavingBetween','andHavingNotBetween','from','into','del','toQuery','then','options','debug','transacting','stream','pipe','bind','catch','finally','asCallback','spread','map','reduce','thenReturn','return','yield','ensure','reflect','get','mapSeries','delay','queryContext','getData','emit','addListener','on','once'];

class Model {
    static get __tableName() {
        return toTableName(this.name);
    }

    static get __columns() {
        return [];
    }

    static get __primaryKey() {
        return 'id';
    }

    static create(data) {
        if(_.isArray(data))
        {
            let collection = [];
            for(let obj of data)
                collection.push(new this(obj));

            collection.map(async (isn) => {
                return isn.save();
            });

            return Promise.all(collection);
        }

        return new this(data).save();
    }

    constructor(...oths) {
        this.exists = false;
        this.columns = new Set();
        this.storage = {};

        if(oths.length > 0)
        {
            let raw = oths[0];

            if(_.isBoolean(oths[0]))
            {
                this.exists = !_.isUndefined(oths[1]);
                raw = oths[1];

                this.primary = raw[this.constructor.__primaryKey];
            }

            for(let attribute in raw)
            {
                this[attribute] = raw[attribute];
                this.storage[attribute] = raw[attribute];
                this.columns.add(attribute);
            }
        }
    }

    populate() {}

    __isChanged() {
        let cols =  new Set(Array.from(this.columns));

        if(!this.exists)
        {
            cols = Object.getOwnPropertyNames(this);
            cols = cols.filter(prop => typeof this[prop] !== 'function' &&
                ['columns', 'storage', 'exists'].indexOf(prop) === -1);

            return new Set(Array.from(cols));
        }

        for(let col of cols)
            if(this.storage[col] === this[col])
                cols.delete(col);

        return cols;
    }

    add(key, value) {
        this[key] = value;
        this.columns[key] = value;
    }

    async save() {
        let cols = this.__isChanged();

        if(cols.size === 0) return this;

        let obj = {};
        for(let c of cols)
        {
            obj[c] = this[c];
            this.storage[c] = this[c];
        }

        if(this.exists)
            await this.constructor.getBuilder()
                .where(this.constructor.__primaryKey, this.primary)
                .update(obj);
        else
        {
            this.exists = true;
            let query = await this.constructor.getBuilder().insert(obj);
            this.primary = query[0];
        }

        return this;
    }

    async del() {
        await this.constructor.getBuilder()
            .where(this.constructor.__primaryKey, this.primary)
            .del();

        return this;
    }

    async delete() {
        return this.del();
    }

    static getBuilder() {
        let builder = db(this.__tableName);
        builder.getData = builder.getData.bind(builder, this);
        return builder;
    }

    static find(id) {
        let primaryKey = this.__primaryKey;
        
        return this.getBuilder()
            .where(primaryKey, id)
            .first()
            .getData();
    }

    static findOne(filter) {
        let builder = this.getBuilder();
        let fields = Object.getOwnPropertyNames(filter);
        if(fields.length == 0)
            return builder.first().getData();

        let tmp = fields.pop();
        builder.where(tmp, filter[tmp]);
        for(tmp of fields)
            builder.andWhere(tmp, filter[tmp]);

        return builder.first()
            .getData();
    }

    get primaryValue() {
        return this.primary;
    }

    hasOne(model, foreign_key, local_key) {
        if(_.isString(model))
            model = DIContainer.resolve(model);

        foreign_key = foreign_key || model.__primaryKey;
        local_key = local_key || this.constructor.name.toLowerCase() + '_id';
        // let tableName = toTableName(model.__tableName);
        return new RSOneToOne(this, model, foreign_key, local_key);
    }

    hasMany(model, foreign_key, local_key) {
        if(_.isString(model))
            model = DIContainer.resolve(model);

        foreign_key = foreign_key || model.__primaryKey;
        local_key = local_key || this.constructor.name.toLowerCase() + '_id';
        return new RSOneToMany(this, model, foreign_key, local_key);
    }

    belongsTo(model, foreign_key, local_key) {
        if(_.isString(model))
            model = DIContainer.resolve(model);

        foreign_key = foreign_key || model.name.toLowerCase() + '_id';
        local_key = local_key || this.constructor.__primaryKey;
        let modelTableName = model.__tableName || model.constructor.__tableName;
        let tableName = this.__tableName || this.constructor.__tableName;

        return model.getBuilder()
            .select(modelTableName + '.*')
            .join(
                tableName,
                modelTableName + '.' + local_key,
                '=',
                tableName + '.' + foreign_key
            )
            .first()
            .getData();
    }

    belongsToMany(model, table_name, foreign_key, local_key) {
        if(_.isString(model))
            model = DIContainer.resolve(model);

        foreign_key = foreign_key || model.name.toLowerCase() + '_id';
        local_key = local_key || this.constructor.name.toLowerCase() + '_id';
        table_name = table_name || this.constructor.name.toLowerCase() + '_' + model.name.toLowerCase();
        return new RSManyToMany(this, model, table_name, foreign_key, local_key);
    }
}

Model.initialize = function() {
    for(let fn of funcs)
        Model[fn] = function(...oths) {
            let builder = db(this.__tableName);
            builder.getData = builder.getData.bind(builder, this);
            return builder[fn](...oths);
        }
};

class RSOneToMany {
    constructor(source, target, foreign_key, local_key) {
        this.targetTableName = target.__tableName || target.constructor.__tableName;
        this.tableName = source.__tableName || source.constructor.__tableName;
        this.source = source;
        this.target = target;
        this.foreign_key = foreign_key;
        this.local_key = local_key;
    }

    collection() {
        return this.target.getBuilder()
            .select(this.targetTableName + '.*')
            .join(
                this.tableName,
                this.targetTableName + '.' + this.local_key,
                '=',
                this.tableName + '.' + this.foreign_key
            )
            .getData();
    }

    save(targetInstance) {
        targetInstance[this.local_key] = this.source[this.foreign_key];
        targetInstance.columns.add(this.local_key);
        
        return targetInstance.save();
    }

    attach(targetInstance) {
        targetInstance[this.local_key] = this.source[this.foreign_key];
        targetInstance.columns.add(this.local_key);
        return this;
    }

    create(data) {
        if(_.isArray(data))
            data.map(obj => {
                obj[this.local_key] = this.source[this.foreign_key];

                return obj;
            });
        else
            data[this.local_key] = this.source[this.foreign_key];
        
        return this.target.create(data);
    }
}

class RSOneToOne extends RSOneToMany{
    constructor(...oths) {
        super(...oths);

        Object.defineProperty(this, 'instance', {
            get: async function() {
                let ins = await this.collection();
                return ins[0];
            }
        });
    }
}

class RSManyToMany {
    constructor(source, target, table_name, foreign_key, local_key) {
        this.targetTableName = target.__tableName || target.constructor.__tableName;
        this.sourceTableName = source.__tableName || source.constructor.__tableName;
        this.targetPrimaryKey = target.__primaryKey || target.constructor.__primaryKey;
        this.sourcePrimaryKey = source.__primaryKey || source.constructor.__primaryKey;
        this.source = source;
        this.target = target;
        this.foreign_key = foreign_key;
        this.local_key = local_key;
        this.table_name = table_name;
    }

    collection() {
        let builder = db(this.table_name);
        builder.getData = builder.getData.bind(builder, this.target);

        return builder
        .select(this.targetTableName + '.*')
        .join(
            this.targetTableName,
            this.table_name + '.' + this.foreign_key,
            '=',
            this.targetTableName + '.' + this.targetPrimaryKey,
        )
        .join(
            this.sourceTableName,
            this.table_name + '.' + this.local_key,
            '=',
            this.sourceTableName + '.' + this.sourcePrimaryKey
        )
        .where(this.sourceTableName + '.' + this.sourcePrimaryKey, this.source.primaryValue)
        .getData()
        .then(async (objs) => {
            for(let obj of objs)
            {
                let raw = await db(this.table_name)
                .where(this.foreign_key, obj.primaryValue)
                .andWhere(this.local_key, this.source.primaryValue)
                .first();

                obj.pivot = new Pivot(this.table_name, this.foreign_key, this.local_key, raw);
            }

            return Promise.resolve(objs);
        });
    }

    async attach(obj, withFields = {}) {
        let raw;

        if(_.isArray(obj))
        {
            let data = [];
            let wfield = _.isArray(withFields);

            for(let i = 0; i < obj.length; i++)
            {
                raw = {};
                raw[this.foreign_key] = _.isNumber(obj[i]) ? obj[i] : obj[i].primaryValue;
                raw[this.local_key] = this.source.primaryValue;
                if(wfield)
                    Object.assign(raw, withFields[i]);

                data.push(raw);
            }

            return db(this.table_name)
                .insert(data);
        }

        raw = {};
        raw[this.foreign_key] = _.isNumber(obj) ? obj : obj.primaryValue;
        raw[this.local_key] = this.source.primaryValue;
        Object.assign(raw, withFields);

        return db(this.table_name)
            .insert(raw);
    }

    async detach(obj) {
        if(_.isArray(obj))
        {
            let ids = [];
            for(let i of obj)
                ids.push(_.isNumber(i) ? i : i.primaryValue);

            return db(this.table_name)
                .whereIn(this.foreign_key, ids)
                .andWhere(this.local_key, this.source.primaryValue)
                .del();
        }

        return db(this.table_name)
            .where(this.foreign_key, _.isNumber(obj) ? obj : obj.primaryValue)
            .andWhere(this.local_key, this.source.primaryValue)
            .first()
            .del();
    }

    async detachAll() {
        return db(this.table_name)
        .where(this.local_key, this.source.primaryValue)
        .del();
    }
}

class Pivot {
    constructor(tableName, foreign_key, local_key, raw) {
        this.tableName = tableName;
        this.foreign_key = foreign_key;
        this.local_key = local_key;
        this.storage = [];
        this.columns = new Set();

        for(let attribute in raw)
        {
            if(attribute !== foreign_key && attribute !== local_key)
            {
                this[attribute] = raw[attribute];
                this.storage[attribute] = raw[attribute];
                this.columns.add(attribute);
            }
            else
                Object.defineProperty(this, attribute, {
                    get: function() {
                        return raw[attribute];
                    }
                });
        }
    }

    __isChanged() {
        let cols =  new Set(Array.from(this.columns));

        for(let col of cols)
            if(this.storage[col] === this[col])
                cols.delete(col);

        return cols;
    }

    async save() {
        let cols = this.__isChanged();

        if(cols.size === 0) return this;

        let obj = {};
        for(let c of cols)
        {
            obj[c] = this[c];
            this.storage[c] = this[c];
        }

        await db(this.tableName)
            .where(this.foreign_key, this[this.foreign_key])
            .andWhere(this.local_key, this[this.local_key])
            .update(obj);

        return this;
    }

    async del() {
        await db(this.tableName)
            .where(this.foreign_key, this[this.foreign_key])
            .andWhere(this.local_key, this[this.local_key])
            .del();

        return this;
    }

    delete() {
        return this.del();
    }
}

module.exports = Model;
