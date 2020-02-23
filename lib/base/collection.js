const _ = require("lodash");

class Collection extends Array {
    find(id) {
        for (let ins of this) if (ins.primaryValue === id) return ins;

        return null;
    }

    first() {
        if (this.length > 0) return this[0];
        return null;
    }

    last() {
        if (this.length > 0) return this[this.length - 1];
        return null;
    }

    shuffle() {
        return _.shuffle(this);
    }

    any() {
        if (this.length === 0) return null;
        let r = Math.floor(Math.random() * this.length);
        return this[r];
    }

    toArrayWith(field) {
        return this.map(c => c[field]);
    }

    valueToNumber() {
        return this.map(c => Number(c));
    }
}

module.exports = Collection;
