export declare function eq(a: any, b: any): any;
export interface Eq<T> {
    equals(t: T): boolean;
}
export interface Monad<T> {
    unit<U>(t: U): Monad<U>;
    bind<U>(f: (t: T) => Monad<U>): Monad<U>;
    of<U>(t: U): Monad<U>;
    chain<U>(f: (t: T) => Monad<U>): Monad<U>;
}
export interface Functor<T> {
    fmap<U>(f: (t: T) => U): Functor<U>;
    lift<U>(f: (t: T) => U): Functor<U>;
    map<U>(f: (t: T) => U): Functor<U>;
}
export interface FMonad<T> extends Functor<T>, Monad<T> {
}
export declare function merge<T, U extends FMonad<T>>(l: U[], unit: <T>(t: T) => FMonad<T>): FMonad<T[]>;
