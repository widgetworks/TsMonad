import { Monad, Functor, Eq } from './monad';
export declare enum EitherType {
    Left = 0,
    Right = 1
}
export interface EitherPatterns<L, R, T> {
    left: (l: L) => T;
    right: (r: R) => T;
}
export declare type OptionalEitherPatterns<L, R, T> = Partial<EitherPatterns<L, R, T>>;
export declare function either<L, R>(l?: L, r?: R): Either<L, R>;
export declare class Either<L, R> implements Monad<R>, Functor<R>, Eq<Either<L, R>> {
    private type;
    private l?;
    private r?;
    constructor(type: EitherType, l?: L, r?: R);
    static left<L, R>(l: L): Either<L, R>;
    static right<L, R>(r: R): Either<L, R>;
    static merge<L, R>(eithers: Either<L, R>[]): Either<L[], R[]>;
    isLeft(): boolean;
    isRight(): boolean;
    unit<T>(t: T): Either<L, T>;
    bind<T>(f: (r: R) => Either<L, T>): Either<L, T>;
    of: <T>(t: T) => Either<L, T>;
    chain: <T>(f: (r: R) => Either<L, T>) => Either<L, T>;
    fmap<T>(f: (r: R) => T): Either<L, T>;
    lift: <T>(f: (r: R) => T) => Either<L, T>;
    map: <T>(f: (r: R) => T) => Either<L, T>;
    mapLeft<T>(f: (l: L) => T): Either<T, R>;
    bimap<L2 = L, R2 = R>(fnL: (l: L) => L2, fnR: (r: R) => R2): Either<L2, R2>;
    caseOf<T>(pattern: EitherPatterns<L, R, T>): T;
    equals(other: Either<L, R>): any;
    do(patterns?: Partial<EitherPatterns<L, R, void>>): Either<L, R>;
}
