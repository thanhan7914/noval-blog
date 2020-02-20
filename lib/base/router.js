const MethodNotFoundError = require('../exceptions/method-not-found-error');
const ExpressRouter = require('express').Router;
const PureRequest = require('./request');
const DIContainer = require('../index');
const root = 'app/';
const utils = require('../utils');
const validate = require('../validate');
const _ = require('lodash');

function prepareMiddleware(options, added = true) {
    let requestInstance = utils.createProxyInstance(new PureRequest, 'req');
    let middleware = [];

    let isn;

    if(options.middleware instanceof Array)
    {
        for(let m of options.middleware)
        {
            isn = DIContainer.resolve(m);
            middleware.push(isn.handle.bind(isn));
        }
    }
    else if(typeof options.middleware === 'string')
    {
        isn = DIContainer.resolve(options.middleware);
        middleware.push(isn.handle.bind(isn));
    }

    if(options.validator instanceof Array)
    {
        for(let m of options.validator)
        {
            isn = DIContainer.resolve(m);
            middleware.push(isn.bindData.bind(isn));
        }
    }
    else if(typeof options.validator === 'string')
    {
        isn = DIContainer.resolve(options.validator);
        middleware.push(isn.bindData.bind(isn));
    }
    else if(typeof options.validator === 'object')
    {
        let mdRequest = utils.createProxyInstance(new PureRequest, 'req');
        mdRequest.rules = function() {
            return options.validator;
        };

        if(typeof options.messages === 'object')
            mdRequest.messages = function() {
                return options.messages;
            };

        middleware.push(mdRequest.bindData.bind(mdRequest));
    }

    if(added)
    {
        if(!_.has(options, ['uses']))
            throw new MethodNotFoundError('missing callback');

        if(typeof options.uses === 'function')
        {
            middleware.push(requestInstance.bindData.bind(requestInstance));
            middleware.push(function(req, res, next) {
                options.uses(requestInstance, res, next);
            });
        }
        else
        {
            let args = options.uses.split('@');
            let instance = DIContainer.resolve(root + 'http/controllers/' + args[0]);
            if(typeof instance[args[1]] !== 'function')
                throw new MethodNotFoundError(`Class ${args[0]} does not have ${args[1]} method`);
        
            let parameters = DIContainer.resolveParameters(root + 'http/controllers/' + args[0],
                    args[1], 'app/http/requests/');
        
            if(parameters.length > 0 && parameters[0] !== null)
                requestInstance = parameters[0];
                //utils.createProxyInstance(parameters[0], 'req');
    
            middleware.push(requestInstance.bindData.bind(requestInstance));
            middleware.push(function(req, res, next) {
                instance[args[1]](requestInstance, res, next);
            });
        }
    }

    return middleware;
}

function serve(router, method, pattern, callback, ...oths) {
    let middleware;

    switch(typeof callback)
    {
        case 'function':
            {
                let pureRequest = utils.createProxyInstance(new PureRequest, 'req');
                middleware = [];
                middleware.push(pureRequest.bindData.bind(pureRequest));
                middleware.push(function(req, res, next) {
                    callback(pureRequest, res, next);
                });
            }
            break;
        case 'string':
            {
                middleware = prepareMiddleware({
                    uses: callback
                });
            }
            break;
        case 'object':
            {
                if(!_.has(callback, ['uses']) && oths.length > 0)
                    callback.uses = oths[0];

                middleware = prepareMiddleware(callback);
            }
            break;
        default:
            middleware = [];
            break;
    }

    router[method](pattern, ...middleware);
}

function createNovalRouter() {
    return utils.createProxyInstance(new Router(), 'router');
}

class Router {
    constructor() {
        this.router = ExpressRouter();
    }

    group(pattern, ...oths) {
        if(typeof pattern === 'string' || pattern instanceof RegExp)
        {
            let novalRouter = createNovalRouter();

            if(oths.length <= 1 || typeof oths[1] !== 'function')
            // throw new MethodNotFoundError('callback must be a function');
            {
                if(typeof oths[0] !== 'function')
                    throw new MethodNotFoundError(`Callback must be a function`);

                this.router.use(pattern, novalRouter.ExpressRouter);
                oths[0](novalRouter);
                return;
            }

            let middleware = prepareMiddleware(oths[0], false);
            this.router.use(pattern, novalRouter.ExpressRouter);
            if(middleware.length > 0)
                novalRouter.use(middleware);
            oths[1](novalRouter);
        }
        else
            this.router.use(pattern, ...oths);
    }

    get(pattern, callback, ...oths) {
        serve(this.router, 'get', pattern, callback, ...oths);
    }

    post(pattern, callback, ...oths) {
        serve(this.router, 'post', pattern, callback, ...oths);
    }

    all(pattern, callback, ...oths) {
        serve(this.router, 'all', pattern, callback, ...oths);
    }

    put(pattern, callback, ...oths) {
        serve(this.router, 'put', pattern, callback, ...oths);
    }

    delete(pattern, callback, ...oths) {
        serve(this.router, 'delete', pattern, callback, ...oths);
    }

    get ExpressRouter() {
        return this.router;
    }
}

module.exports = createNovalRouter;
