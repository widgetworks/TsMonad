import {Either, either} from '../src/either'

import * as assert from 'assert'

describe('Either', () => {

    it('Case of', () => {

        assert.ok(Either.left<string, number>('on noes')
            .caseOf({
                left: s => true,
                right: n => false
            }));

        assert.ok(Either.right<string, number>(1)
            .caseOf({
                left: s => false,
                right: n => true
            }));
    });

    it('isLeft', () => {
        assert.ok(Either.left(2).isLeft());

        assert.strictEqual(Either.right(2).isLeft(), false);
    });

    it('isRight', () => {
        assert.ok(Either.right(2).isRight());

        assert.strictEqual(Either.left(2).isRight(), false);
    });

    it('Do', () => {

        assert.throws(() =>
            either('l', null).do({
                left: (l) => { throw 'left'; },
                right: (r) => { throw 'right'; },
            }),
            /left/,
            'do has a `left` path'
        );

        assert.throws(() =>
            either(null, 'r').do({
            left: (l) => { throw 'left'; },
            right: (r) => { throw 'right'; },
            }),
            /right/,
            'do has a `right` path'
        );

    });

    it('Bind', () => {

        assert.ok(Either.right<string, number>(2)
            .bind(n => Either.right<string, number>(n * 2))
            .bind(n => Either.right<string, number>(n * 2))
            .caseOf({
                left: s => false,
                right: n => n === 8
            }));

        assert.ok(Either.right<string, number>(2)
            .bind(n => Either.right<string, number>(n * 2))
            .bind(n => Either.left<string, number>('nooo'))
            .caseOf({
                left: s => s === 'nooo',
                right: n => false
            }));
    });

    it('Lift', () => {

        assert.ok(Either.right<string, number>(2)
            .lift(n => n * 2)
            .lift(n => n * 2)
            .caseOf({
                left: s => false,
                right: n => n === 8
            }));

        assert.ok(Either.right<string, number>(2)
            .lift(n => n * 2)
            .lift(n => <number>null)
            .caseOf({
                left: s => false,
                right: n => !n
                // unlike Maybe, lifting a null into Either has no special behaviour
                // so try to avoid this kind of sociopathic behaviour
            }));
    });

    it('Constructors', () => {

        assert.ok(either<string, number>('oh noes')
            .caseOf({
                left: s => s === 'oh noes',
                right: n => false
            }));

        assert.ok(either<string, number>(null, 123)
            .caseOf({
                left: s => false,
                right: n => n === 123
            }));

        assert.throws(() => either('not both', 123), /both/);
        assert.throws(() => either<string,number>(), /neither/);
    });
    
    
    //wiwo
    describe('merge', () => {
        
        it('merges Either<R>[] to Either<R[]>', function(){
            const m = Either.merge([
                Either.right<string, string>('good'),
                Either.right<string, string>('good'),
                Either.right<string, string>('good')
            ]);
            
            const result = m.lift(s => s.join(''))
                .caseOf({
                    left: s => s.join(''),
                    right: s => s
                });
            
            assert.ok(result);
        });
        
        it('merge Either<L>[] to single Either<L>', function(){
            const m = Either.merge([
                Either.right<string, string>('good'),
                Either.left<string, string>('bad1'),
                Either.right<string, string>('good'),
                Either.left<string, string>('bad2'),
            ]);
            
            const result: string = m.lift(s => s.join(''))
                .caseOf({
                    left: s => s.join(''),
                    right: s => s,
                });
            
            assert.equal(result, 'bad1bad2');
            // assert.equal(result, null);
        });
        
    });
    
    
    //wiwo
    describe('mapLeft', function(){
        
        it('skips Right<T>', function(){
        	
            const m = Either.right<number, string>('good');
            
            let wasCalled = false;
            m.mapLeft((n) => {
                wasCalled = true;
            });
            
            assert.equal(wasCalled, false);
            // assert.equal(wasCalled, null);
            
        });
        
        
        it('maps over Left<T>', function(){
        	
            const m = Either.left<number, string>(5);
            
            let wasCalled = false;
            const mLeft = m.mapLeft((n) => {
                wasCalled = true;
                return n * 100;
            });
            
            const result = mLeft.caseOf({
                left: value => value,
                right: () => -1,
            })
            
            assert.equal(wasCalled, true);
            assert.equal(result, 500);
            // assert.equal(result, -1);
            // assert.equal(wasCalled, null);
            
        });
        
    });

})
