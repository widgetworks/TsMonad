import { eq, merge } from './monad.js';
export var MaybeType;
(function (MaybeType) {
    MaybeType[MaybeType["Nothing"] = 0] = "Nothing";
    MaybeType[MaybeType["Just"] = 1] = "Just";
})(MaybeType || (MaybeType = {}));
export function maybe(t) {
    return Maybe.maybe(t);
}
export class Maybe {
    type;
    value;
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    static sequence(t) {
        if (Object.keys(t).filter(k => t[k].type === MaybeType.Nothing).length) {
            return Maybe.nothing();
        }
        var result = {};
        for (var k in t) {
            if (t.hasOwnProperty(k)) {
                result[k] = t[k].value;
            }
        }
        return Maybe.just(result);
    }
    static all = (t) => Maybe.sequence(t);
    static maybe(t) {
        return t === null || t === undefined
            ? new Maybe(MaybeType.Nothing)
            : new Maybe(MaybeType.Just, t);
    }
    static just(t) {
        if (t === null || t === undefined) {
            throw new TypeError('Cannot Maybe.just(null)');
        }
        return new Maybe(MaybeType.Just, t);
    }
    static nothing() {
        return new Maybe(MaybeType.Nothing);
    }
    static isJust(t) {
        return t.type === MaybeType.Just;
    }
    static isNothing(t) {
        return t.type === MaybeType.Nothing;
    }
    static merge(maybes) {
        return merge(maybes, Maybe.maybe);
    }
    unit(u) {
        return Maybe.maybe(u);
    }
    bind(f) {
        return this.type === MaybeType.Just ?
            f(this.value) :
            Maybe.nothing();
    }
    of = this.unit;
    chain = this.bind;
    fmap(f) {
        return this.bind(v => this.unit(f(v)));
    }
    lift = this.fmap;
    map = this.fmap;
    caseOf(patterns) {
        return this.type === MaybeType.Just ?
            patterns.just(this.value) :
            patterns.nothing();
    }
    defaulting(defaultValue) {
        return Maybe.just(this.valueOr(defaultValue));
    }
    equals(other) {
        return other.type === this.type &&
            (this.type === MaybeType.Nothing || eq(other.value, this.value));
    }
    valueOr(defaultValue) {
        return this.valueOrCompute(() => defaultValue);
    }
    valueOrCompute(defaultValueFunction) {
        return this.type === MaybeType.Just ? this.value : defaultValueFunction();
    }
    valueOrThrow(error) {
        if (this.type === MaybeType.Just) {
            return this.value;
        }
        throw (error || new Error('No value is available.'));
    }
    do(patterns = {}) {
        let noop_pattern = {
            just: (t) => { },
            nothing: () => { },
        };
        let merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    }
}
//# sourceMappingURL=maybe.js.map