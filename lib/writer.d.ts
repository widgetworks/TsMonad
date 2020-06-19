import { Monad, Eq } from './monad';
export interface WriterPatterns<S, T, U> {
    writer: (story: S[], value: T) => U;
}
export declare function writer<S, T>(story: S[], value: T): Writer<S, T>;
export declare class Writer<S, T> implements Monad<T>, Eq<Writer<S, T>> {
    private story;
    private value;
    constructor(story: S[], value: T);
    static writer<S, T>(story: S[], value: T): Writer<S, T>;
    static tell<S>(s: S): Writer<S, number>;
    unit<U>(u: U): Writer<any, U>;
    bind<U>(f: (t: T) => Writer<S, U>): Writer<S, U>;
    of: <U>(u: U) => Writer<any, U>;
    chain: <U>(f: (t: T) => Writer<S, U>) => Writer<S, U>;
    fmap<U>(f: (t: T) => U): Writer<S, U>;
    lift: <U>(f: (t: T) => U) => Writer<S, U>;
    map: <U>(f: (t: T) => U) => Writer<S, U>;
    caseOf<U>(patterns: WriterPatterns<S, T, U>): U;
    equals(other: Writer<S, T>): boolean;
}
