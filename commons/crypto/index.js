const crypto = require("crypto");
const _ = require("lodash");

let encode = function(text, secret, code = "aes256") {
    if (_.isUndefined(code)) code = "aes256";
    if (_.isUndefined(secret)) secret = key();
    const cipher = crypto.createCipher(code, secret);
    let encode = cipher.update(text, "utf8", "hex");
    return encode + cipher.final("hex");
};

let decode = function(encode, secret, code = "aes256") {
    if (_.isUndefined(code)) code = "aes256";
    if (_.isUndefined(secret)) secret = key();
    const decipher = crypto.createDecipher(code, secret);
    let text = decipher.update(encode, "hex", "utf8");
    return text + decipher.final("utf8");
};

let createHash = function(text, code = "sha256") {
    if (_.isUndefined(code)) code = "sha256";
    const hash = crypto.createHash(code);

    hash.update(text);
    return hash.digest("hex");
};

let createHmac = function(text, secret, code = "sha256") {
    if (_.isUndefined(code)) code = "sha256";
    if (_.isUndefined(secret)) secret = key();
    const hmac = crypto.createHmac(code, secret);

    hmac.update(text);
    return hmac.digest("hex");
};

module.exports = {
    encode,
    decode,
    createHash,
    createHmac
};
