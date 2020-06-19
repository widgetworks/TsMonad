"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monad_1 = require("./monad");
var EitherType;
(function (EitherType) {
    EitherType[EitherType["Left"] = 0] = "Left";
    EitherType[EitherType["Right"] = 1] = "Right";
})(EitherType = exports.EitherType || (exports.EitherType = {}));
function exists(t) {
    return t !== null && t !== undefined;
}
function either(l, r) {
    if (exists(l) && exists(r)) {
        throw new TypeError('Cannot construct an Either with both a left and a right');
    }
    if (!exists(l) && !exists(r)) {
        throw new TypeError('Cannot construct an Either with neither a left nor a right');
    }
    if (exists(l) && !exists(r)) {
        return Either.left(l);
    }
    if (!exists(l) && exists(r)) {
        return Either.right(r);
    }
}
exports.either = either;
var Either = (function () {
    function Either(type, l, r) {
        this.type = type;
        this.l = l;
        this.r = r;
        this.of = this.unit;
        this.chain = this.bind;
        this.lift = this.fmap;
        this.map = this.fmap;
    }
    Either.left = function (l) {
        return new Either(EitherType.Left, l);
    };
    Either.right = function (r) {
        return new Either(EitherType.Right, null, r);
    };
    Either.merge = function (eithers) {
        var empty = Either.right([]);
        return eithers.reduce(function (res, v) {
            var result = res.caseOf({
                left: function (resLeft) {
                    return v.caseOf({
                        left: function (vLeft) {
                            resLeft.push(vLeft);
                            return Either.left(resLeft);
                        },
                        right: function () {
                            return res;
                        },
                    });
                },
                right: function (resRight) {
                    return v.caseOf({
                        left: function (vLeft) {
                            return Either.left([vLeft]);
                        },
                        right: function (vRight) {
                            resRight.push(vRight);
                            return Either.right(resRight);
                        },
                    });
                },
            });
            return result;
        }, empty);
    };
    Either.prototype.isLeft = function () {
        return this.type === EitherType.Left;
    };
    Either.prototype.isRight = function () {
        return this.type === EitherType.Right;
    };
    Either.prototype.unit = function (t) {
        return Either.right(t);
    };
    Either.prototype.bind = function (f) {
        return this.type === EitherType.Right ?
            f(this.r) :
            Either.left(this.l);
    };
    Either.prototype.fmap = function (f) {
        var _this = this;
        return this.bind(function (v) { return _this.unit(f(v)); });
    };
    Either.prototype.mapLeft = function (f) {
        return this.isLeft() ? Either.left(f(this.l)) : Either.right(this.r);
    };
    Either.prototype.bimap = function (fnL, fnR) {
        return this.isLeft() ? Either.left(fnL(this.l)) : Either.right(fnR(this.r));
    };
    Either.prototype.caseOf = function (pattern) {
        return this.type === EitherType.Right ?
            pattern.right(this.r) :
            pattern.left(this.l);
    };
    Either.prototype.equals = function (other) {
        return other.type === this.type &&
            ((this.type === EitherType.Left && monad_1.eq(other.l, this.l)) ||
                (this.type === EitherType.Right && monad_1.eq(other.r, this.r)));
    };
    Either.prototype.do = function (patterns) {
        if (patterns === void 0) { patterns = {}; }
        var noop_pattern = {
            left: function (l) { },
            right: function (r) { },
        };
        var merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    };
    return Either;
}());
exports.Either = Either;
//# sourceMappingURL=either.js.map