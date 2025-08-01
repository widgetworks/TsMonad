import { eq } from './monad.js';
export var EitherType;
(function (EitherType) {
    EitherType[EitherType["Left"] = 0] = "Left";
    EitherType[EitherType["Right"] = 1] = "Right";
})(EitherType || (EitherType = {}));
function exists(t) {
    return t !== null && t !== undefined;
}
export function either(l, r) {
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
export class Either {
    type;
    l;
    r;
    constructor(type, l, r) {
        this.type = type;
        this.l = l;
        this.r = r;
    }
    static left(l) {
        return new Either(EitherType.Left, l);
    }
    static right(r) {
        return new Either(EitherType.Right, null, r);
    }
    static merge(eithers) {
        const empty = Either.right([]);
        return eithers.reduce((res, v) => {
            const result = res.caseOf({
                left: (resLeft) => {
                    return v.caseOf({
                        left: (vLeft) => {
                            resLeft.push(vLeft);
                            return Either.left(resLeft);
                        },
                        right: () => {
                            return res;
                        },
                    });
                },
                right: (resRight) => {
                    return v.caseOf({
                        left: (vLeft) => {
                            return Either.left([vLeft]);
                        },
                        right: (vRight) => {
                            resRight.push(vRight);
                            return Either.right(resRight);
                        },
                    });
                },
            });
            return result;
        }, empty);
    }
    isLeft() {
        return this.type === EitherType.Left;
    }
    isRight() {
        return this.type === EitherType.Right;
    }
    unit(t) {
        return Either.right(t);
    }
    bind(f) {
        return this.type === EitherType.Right ?
            f(this.r) :
            Either.left(this.l);
    }
    of = this.unit;
    chain = this.bind;
    fmap(f) {
        return this.bind(v => this.unit(f(v)));
    }
    lift = this.fmap;
    map = this.fmap;
    mapLeft(f) {
        return this.isLeft() ? Either.left(f(this.l)) : Either.right(this.r);
    }
    bimap(fnL, fnR) {
        return this.isLeft() ? Either.left(fnL(this.l)) : Either.right(fnR(this.r));
    }
    caseOf(pattern) {
        return this.type === EitherType.Right ?
            pattern.right(this.r) :
            pattern.left(this.l);
    }
    equals(other) {
        return other.type === this.type &&
            ((this.type === EitherType.Left && eq(other.l, this.l)) ||
                (this.type === EitherType.Right && eq(other.r, this.r)));
    }
    do(patterns = {}) {
        let noop_pattern = {
            left: (l) => { },
            right: (r) => { },
        };
        let merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    }
}
//# sourceMappingURL=either.js.map