"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function eq(a, b) {
    var idx = 0;
    if (a === b) {
        return true;
    }
    if (typeof a.equals === 'function') {
        return a.equals(b);
    }
    if (a.length > 0 && a.length === b.length) {
        for (; idx < a.length; idx += 1) {
            if (!eq(a[idx], b[idx])) {
                return false;
            }
        }
        return true;
    }
    return false;
}
exports.eq = eq;
function merge(l, unit) {
    if (!Array.isArray(l) || l.length === 0) {
        return unit([]);
    }
    var rec = function (l_, r) {
        if (l_.length === 0) {
            return unit(r);
        }
        return l_[0].bind(function (x) { return rec(l_.slice(1), r.concat([x])); });
    };
    var empty = [];
    var ret = rec(l, empty);
    return ret;
}
exports.merge = merge;
//# sourceMappingURL=monad.js.map