const _ = require('lodash');
const utils = require('../utils');
const lang = require('../lang');
const config = require('../config');
let nativeRender;

function prepareData(req) {
    let errors = _.isUndefined(req.errors) ? [] : req.errors;

    return _.merge({},
        {
            config: config,
            trans: lang.trans,
            csrfToken: function() {
                return req.csrfToken();
            },
            request: {
                error: function(name) {
                    if(!(errors instanceof Array)) return null;
        
                    for(let e of errors)
                        if(e.key === name)
                            return e.validate.message;
        
                    return null;
                },
                errors: errors,
                old: function(name) {
                    console.log(req.old);
                    
                    if(_.isFunction(req.old))
                        return req.old(name);
                    return null;
                },
                get: req.getInput
            }
        },
        req.package
    );
}

module.exports = function(req, res) {
    res.goBack = function() {
        let backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    };

    res.redirectWithError = function(url, errors) {
        if(!_.isArray(errors)) errors = [errors];
        if(_.isUndefined(req.session.errors))
            req.session.errors = [];

        for(let error of errors)
        {
            if(!_.has(error, 'key') && _.has(error, 'name'))
                error.key = error.name;
            if(!_.has(error, 'validate') && _.has(error, 'message'))
                error.validate = {message: error.message, passed: false};
            if(!_.has(error, 'key'))
                error.key = 'error';
            
            req.session.errors.push(error);
        }

        res.redirect(url);
    };

    nativeRender = res.render;//.bind(res);

    res.render = function(...oths) {
        let rData = prepareData(req);

        if(oths.length === 1)
        {
            oths.push(rData)
            return nativeRender.apply(res, oths);
        }

        oths[1] = Object.assign(oths[1], rData);
        nativeRender.apply(res, oths);
    }
};
