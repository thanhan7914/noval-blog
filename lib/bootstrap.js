const path = require('path');
global.__APP__ = path.join(__dirname, '../app');
global.__LIB__ = __dirname;

module.exports = function(injection) {
    require('./index');
    require('./server')(injection);
};
