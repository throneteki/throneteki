import GainGold from '../../../server/game/GameActions/GainGold.js';

describe('GainGold', function () {
    beforeEach(function () {
        this.playerSpy = jasmine.createSpyObj('player', ['getGoldToGain', 'modifyGold']);
        this.playerSpy.getGoldToGain.and.returnValue(2);
        this.playerSpy.gainedGold = 0;
        this.props = { player: this.playerSpy, amount: 3 };
    });

    describe('allow()', function () {
        describe('when the player can gain gold', function () {
            beforeEach(function () {
                this.playerSpy.getGoldToGain.and.returnValue(1);
            });

            it('returns true', function () {
                expect(GainGold.allow(this.props)).toBe(true);
            });
        });

        describe('when the player cannot gain gold', function () {
            beforeEach(function () {
                this.playerSpy.getGoldToGain.and.returnValue(0);
            });

            it('returns false', function () {
                expect(GainGold.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = GainGold.createEvent(this.props);
        });

        it('creates an onGoldGained event', function () {
            expect(this.event.name).toBe('onGoldGained');
            expect(this.event.player).toBe(this.playerSpy);
            expect(this.event.amount).toBe(2);
            expect(this.event.desiredAmount).toBe(3);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('modifies the gold for the player', function () {
                expect(this.playerSpy.modifyGold).toHaveBeenCalledWith(2);
            });

            it('increments the amount of gold gained', function () {
                expect(this.playerSpy.gainedGold).toBe(2);
            });
        });
    });
});
