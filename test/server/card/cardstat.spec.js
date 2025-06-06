import CardStat from '../../../server/game/cardStat.js';

describe('CardStat', function () {
    beforeEach(function () {
        this.testStat = new CardStat(3);
    });

    it('should return the printed value by default', function () {
        expect(this.testStat.calculate()).toBe(3);
    });

    it('should report undefined whent there is no set value', function () {
        expect(this.testStat.setValue).toBe(undefined);
    });

    it('should override the printed value with a set value', function () {
        this.testStat.setTheValue(1111, 2);
        expect(this.testStat.calculate()).toBe(2);
        expect(this.testStat.setValue).toBe(2);
    });

    it('should calculate an appropriate value with a modifier when a value is not set', function () {
        this.testStat.modifier = 1;
        expect(this.testStat.calculate()).toBe(4);
    });

    it('should not apply a modifier while a value is set', function () {
        this.testStat.setTheValue(1111, 2);
        this.testStat.modifier = 1;
        expect(this.testStat.calculate()).toBe(2);
        this.testStat.removeSetEffect(1111);
        expect(this.testStat.calculate()).toBe(4);
    });

    it('should revert to the previously modified value when a set value expires', function () {
        this.testStat.modifier = 1;
        this.testStat.setTheValue(1111, 2);
        expect(this.testStat.calculate()).toBe(2);
        this.testStat.removeSetEffect(1111);
        expect(this.testStat.calculate()).toBe(4);
    });

    it('should report the latest set value', function () {
        this.testStat.setTheValue(1111, 2);
        expect(this.testStat.calculate()).toBe(2);
        expect(this.testStat.setValue).toBe(2);
        this.testStat.setTheValue(2222, 5);
        expect(this.testStat.calculate()).toBe(5);
        expect(this.testStat.setValue).toBe(5);
        this.testStat.setTheValue(3333, 6);
        expect(this.testStat.calculate()).toBe(6);
        expect(this.testStat.setValue).toBe(6);
        this.testStat.removeSetEffect(2222);
        expect(this.testStat.calculate()).toBe(6);
        expect(this.testStat.setValue).toBe(6);
        this.testStat.removeSetEffect(3333);
        expect(this.testStat.calculate()).toBe(2);
        expect(this.testStat.setValue).toBe(2);
        this.testStat.removeSetEffect(1111);
        expect(this.testStat.calculate()).toBe(3);
        expect(this.testStat.setValue).toBe(undefined);
    });

    describe('when the strength has been modified below 0', function () {
        beforeEach(function () {
            this.testStat.modifier = -4;
        });

        it('should return 0', function () {
            expect(this.testStat.calculate()).toBe(0);
        });
    });

    describe('when the strength has been multiplied', function () {
        beforeEach(function () {
            this.testStat.multiplier = 2;
            this.testStat.modifier = 1;
        });

        it('should return the strength multiplied after addition/subtraction modifiers have been applied', function () {
            expect(this.testStat.calculate()).toBe(8);
        });
    });

    describe('when the strength becomes fractional', function () {
        beforeEach(function () {
            this.testStat.multiplier = 0.5;
        });

        it('should return the rounded strength', function () {
            expect(this.testStat.calculate()).toBe(2);
        });
    });

    it('should not multiply a set value', function () {
        this.testStat.multiplier = 2;
        this.testStat.setTheValue(1111, 1);
        expect(this.testStat.calculate()).toBe(1);
        this.testStat.multiplier = 3;
        expect(this.testStat.calculate()).toBe(1);
    });

    describe('clone', function () {
        it('should create an entirely independent copy', function () {
            this.testStat.setTheValue(1111, 1);
            let clonedStat = this.testStat.clone();
            clonedStat.removeSetEffect(1111);
            clonedStat.modifier = 1;
            clonedStat.multiplier = 2;
            expect(this.testStat.setValue).toBe(1);
            expect(this.testStat.modifier).toBe(0);
            expect(this.testStat.multiplier).toBe(1);
        });
    });
});
