import CardStat from '../../../server/game/cardStat.js';

describe('CardStat', function () {
    beforeEach(function () {
        this.testStat = new CardStat(3);
        this.testSource1 = {
            uuid: 1111
        };
        this.testSource2 = {
            uuid: 2222
        };
        this.testSource3 = {
            uuid: 3333
        };
    });

    it('should return the printed value by default', function () {
        expect(this.testStat.calculate()).toBe(3);
    });

    it('should report undefined for set value when there is no set value', function () {
        expect(this.testStat.setValue).toBe(undefined);
    });

    it('should override the printed value with a set value', function () {
        this.testStat.addSetValue(this.testSource1, 2);
        expect(this.testStat.calculate()).toBe(2);
        expect(this.testStat.setValue).toBe(2);
    });

    it('should calculate an appropriate value with a modifier when a value is not set', function () {
        this.testStat.modifier = 1;
        expect(this.testStat.calculate()).toBe(4);
    });

    it('should not apply a modifier while a value is set, but apply it thereafter', function () {
        this.testStat.addSetValue(this.testSource1, 2);
        this.testStat.modifier = 1;
        expect(this.testStat.calculate()).toBe(2);
        this.testStat.removeSetValue(this.testSource1);
        expect(this.testStat.calculate()).toBe(4);
    });

    it('should report the latest set value', function () {
        this.testStat.addSetValue(this.testSource1, 2);
        expect(this.testStat.calculate()).toBe(2);
        expect(this.testStat.setValue).toBe(2);
        this.testStat.addSetValue(this.testSource2, 5);
        expect(this.testStat.calculate()).toBe(5);
        expect(this.testStat.setValue).toBe(5);
        this.testStat.addSetValue(this.testSource3, 6);
        expect(this.testStat.calculate()).toBe(6);
        expect(this.testStat.setValue).toBe(6);
        this.testStat.removeSetValue(this.testSource2);
        expect(this.testStat.calculate()).toBe(6);
        expect(this.testStat.setValue).toBe(6);
        this.testStat.removeSetValue(this.testSource3);
        expect(this.testStat.calculate()).toBe(2);
        expect(this.testStat.setValue).toBe(2);
        this.testStat.removeSetValue(this.testSource1);
        expect(this.testStat.calculate()).toBe(3);
        expect(this.testStat.setValue).toBe(undefined);
    });

    describe('when the value has been modified below 0', function () {
        beforeEach(function () {
            this.testStat.modifier = -4;
        });

        it('should return 0', function () {
            expect(this.testStat.calculate()).toBe(0);
        });
    });

    describe('when the value has been multiplied', function () {
        beforeEach(function () {
            this.testStat.multiplier = 2;
            this.testStat.modifier = 1;
        });

        it('should return the value multiplied after addition/subtraction modifiers have been applied', function () {
            expect(this.testStat.calculate()).toBe(8);
        });
    });

    describe('when the value becomes fractional', function () {
        beforeEach(function () {
            this.testStat.multiplier = 0.5;
        });

        it('should return the rounded value', function () {
            expect(this.testStat.calculate()).toBe(2);
        });
    });

    it('should not multiply a set value', function () {
        this.testStat.multiplier = 2;
        this.testStat.addSetValue(this.testSource1, 1);
        expect(this.testStat.calculate()).toBe(1);
        this.testStat.multiplier = 3;
        expect(this.testStat.calculate()).toBe(1);
    });

    describe('clone', function () {
        it('should create an entirely independent copy', function () {
            this.testStat.addSetValue(this.testSource1, 1);
            let clonedStat = this.testStat.clone();
            clonedStat.removeSetValue(this.testSource1);
            clonedStat.modifier = 1;
            clonedStat.multiplier = 2;
            expect(this.testStat.setValue).toBe(1);
            expect(this.testStat.modifier).toBe(0);
            expect(this.testStat.multiplier).toBe(1);
        });
    });
});
