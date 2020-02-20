const root_middleware = 'app/http/middleware';
const path = require('path');
const fs = require('fs');
const { join } = require('./utils');
const _ = require('lodash');

function load() {
    let fullpath = path.join(__dirname, '../', root_middleware, 'config.json');

    if(fs.existsSync(fullpath))
    {
        let cf = require(fullpath);

        return {
            all: cf.all.map(name => {
                if(!name.startsWith(root_middleware))
                    return join(root_middleware, name);
                return name;
            }),
            web: cf.web.map(name => {
                if(!name.startsWith(root_middleware))
                    return join(root_middleware, name);
                return name;
            }),
            api: cf.api.map(name => {
                if(!name.startsWith(root_middleware))
                    return join(root_middleware, name);
                return name;
            })
        };
    }
    else
    {
        let modules = _.keys(DIContainer.modules).filter(m => m.startsWith(root_middleware));

        return {
            all: modules,
            web: [],
            api: []
        }
    }
}

let middlewares = load();

module.exports = function (app, scope = 'all') {
    const DIContainer = require('./index');

    for(let m of middlewares[scope])
    {
        app.use(function (req, res, next) {
            DIContainer.resolve(m).handle(req, res, next);
        });
    }
};
