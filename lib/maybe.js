"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monad_1 = require("./monad");
var MaybeType;
(function (MaybeType) {
    MaybeType[MaybeType["Nothing"] = 0] = "Nothing";
    MaybeType[MaybeType["Just"] = 1] = "Just";
})(MaybeType = exports.MaybeType || (exports.MaybeType = {}));
function maybe(t) {
    return Maybe.maybe(t);
}
exports.maybe = maybe;
var Maybe = (function () {
    function Maybe(type, value) {
        this.type = type;
        this.value = value;
        this.of = this.unit;
        this.chain = this.bind;
        this.lift = this.fmap;
        this.map = this.fmap;
    }
    Maybe.sequence = function (t) {
        if (Object.keys(t).filter(function (k) { return t[k].type === MaybeType.Nothing; }).length) {
            return Maybe.nothing();
        }
        var result = {};
        for (var k in t) {
            if (t.hasOwnProperty(k)) {
                result[k] = t[k].value;
            }
        }
        return Maybe.just(result);
    };
    Maybe.maybe = function (t) {
        return t === null || t === undefined
            ? new Maybe(MaybeType.Nothing)
            : new Maybe(MaybeType.Just, t);
    };
    Maybe.just = function (t) {
        if (t === null || t === undefined) {
            throw new TypeError('Cannot Maybe.just(null)');
        }
        return new Maybe(MaybeType.Just, t);
    };
    Maybe.nothing = function () {
        return new Maybe(MaybeType.Nothing);
    };
    Maybe.isJust = function (t) {
        return t.type === MaybeType.Just;
    };
    Maybe.isNothing = function (t) {
        return t.type === MaybeType.Nothing;
    };
    Maybe.merge = function (maybes) {
        return monad_1.merge(maybes, Maybe.maybe);
    };
    Maybe.prototype.unit = function (u) {
        return Maybe.maybe(u);
    };
    Maybe.prototype.bind = function (f) {
        return this.type === MaybeType.Just ?
            f(this.value) :
            Maybe.nothing();
    };
    Maybe.prototype.fmap = function (f) {
        var _this = this;
        return this.bind(function (v) { return _this.unit(f(v)); });
    };
    Maybe.prototype.caseOf = function (patterns) {
        return this.type === MaybeType.Just ?
            patterns.just(this.value) :
            patterns.nothing();
    };
    Maybe.prototype.defaulting = function (defaultValue) {
        return Maybe.just(this.valueOr(defaultValue));
    };
    Maybe.prototype.equals = function (other) {
        return other.type === this.type &&
            (this.type === MaybeType.Nothing || monad_1.eq(other.value, this.value));
    };
    Maybe.prototype.valueOr = function (defaultValue) {
        return this.valueOrCompute(function () { return defaultValue; });
    };
    Maybe.prototype.valueOrCompute = function (defaultValueFunction) {
        return this.type === MaybeType.Just ? this.value : defaultValueFunction();
    };
    Maybe.prototype.valueOrThrow = function (error) {
        if (this.type === MaybeType.Just) {
            return this.value;
        }
        throw (error || new Error('No value is available.'));
    };
    Maybe.prototype.do = function (patterns) {
        if (patterns === void 0) { patterns = {}; }
        var noop_pattern = {
            just: function (t) { },
            nothing: function () { },
        };
        var merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    };
    Maybe.all = function (t) { return Maybe.sequence(t); };
    return Maybe;
}());
exports.Maybe = Maybe;
//# sourceMappingURL=maybe.js.map