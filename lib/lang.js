const lang = require('./jsoni')('../resources/lang');
let locale = 'en';

module.exports = {
    trans: function (key) {
        let text = lang(locale + '.' + key);
        if(text == null) return key;

        return text;
    },
    setLocale: function (loc) {
        locale = loc;
    },
    getLocale: function() {
        return locale;
    }
};
