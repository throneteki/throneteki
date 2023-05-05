const Matcher = require('../../server/game/Matcher.js');

describe('Matcher', function() {
    describe('containsValue', function() {
        it('should return true when the expected value is undefined', function() {
            expect(Matcher.containsValue(undefined, () => 1)).toBe(true);
        });

        it('should return true when the values match', function() {
            expect(Matcher.containsValue(1, () => 1)).toBe(true);
        });

        it('should return false when the values do not match', function() {
            expect(Matcher.containsValue(2, () => 1)).toBe(false);
        });

        describe('when the expected value is an array', function() {
            it('should return true if the actual value is contained in the array', function() {
                expect(Matcher.containsValue([1, 2, 3], () => 2)).toBe(true);
            });
        });
    });

    describe('anyValue', function() {
        beforeEach(function() {
            this.predicateSpy = jasmine.createSpy('predicate');
        });

        it('should return true when the expected value is undefined', function() {
            expect(Matcher.anyValue(undefined, this.predicateSpy)).toBe(true);
        });

        it('should call the predicate using the expected value', function() {
            Matcher.anyValue(1, this.predicateSpy);
            expect(this.predicateSpy).toHaveBeenCalledWith(1);
        });

        it('should return true when the predicate returns true', function() {
            this.predicateSpy.and.returnValue(true);
            expect(Matcher.anyValue(1, this.predicateSpy)).toBe(true);
        });

        it('should return false when the predicate returns false', function() {
            this.predicateSpy.and.returnValue(false);
            expect(Matcher.anyValue(1, this.predicateSpy)).toBe(false);
        });

        describe('when the expected value is an array', function() {
            it('should call the predicate with values in the array', function() {
                Matcher.anyValue([1, 2, 3], this.predicateSpy);
                expect(this.predicateSpy).toHaveBeenCalledWith(1);
                expect(this.predicateSpy).toHaveBeenCalledWith(2);
                expect(this.predicateSpy).toHaveBeenCalledWith(3);
            });

            it('should return true if the predicate returns true for at least 1 value in the array', function() {
                this.predicateSpy.and.callFake(i => i % 2 === 0);
                expect(Matcher.anyValue([1, 2, 3], this.predicateSpy)).toBe(true);
            });
        });
    });
});
