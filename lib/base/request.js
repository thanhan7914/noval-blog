const _ = require('lodash');
const validate = require('../validate');
const utils = require('../utils');
const AccessDeniedHttpError = require('../exceptions/access-denied-http-error');
const ValidationError = require('../exceptions/validation-error');

class Request {
    async bindData(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        let self = this;
        this.fields = _.merge({}, req.query, _.isUndefined(req.body) ? {} : req.body,
            _.isUndefined(req.fields) ? {} : req.fields, _.isUndefined(req.files) ? {} : req.files);
        this.fields = _.mapKeys(this.fields, function(value, key) {
            let x = key.replace(/(\[\])/, '');
            if(x in self.types() && self.types()[x] === 'array')
                return x;

            return key;
        });
        this.fields = _.mapValues(this.fields, function(v, x) {
                if(x in self.types())
                    return utils.convert(v, self.types()[x]);

                //return utils.parse(v);
                return v;
        });

        req.fields = this.fields;

        if(!this.auth())
        {
            next(new AccessDeniedHttpError())
            return;
        }

        let result_valid = await validate(this, this.rules(), this.messages());
        let pass = result_valid.map(r => r.validate.passed).filter(b => !b);

        if(pass.length > 0)
        {
            if(typeof this.renderIfError === 'function')
                return this.renderIfError(result_valid.filter(r => !r.validate.passed), req, res);

            if(req.originalUrl.startsWith('/api/') || this.preventGoBack())
            {
                next(new ValidationError(result_valid.filter(r => !r.validate.passed)));
                return;
            }

            req.session.errors = result_valid.filter(r => !r.validate.passed);
            req.session.inputData = this.fields;
            res.goBack();
            return;
        }

        next();
    }

    auth() {
        return true;
    }

    rules() {
        return {};
    }

    messages() {
        return {};
    }

    types() {
        return {};
    }

    preventGoBack() {
        return false;
    }

    get HttpRequest() {
        return this.req;
    }

    add(field, value) {
        this.fields[field] = value;
    }

    get(field) {
        if(_.isUndefined(this.fields[field]))
            return null;
        
        return this.fields[field];
    }

    all() {
        return this.fields;
    }

    only(fields) {
        let data = {};

        for(let i of fields)
        {
            data[i] = this.get(i);
        }

        return data;
    }
}

module.exports = Request;
