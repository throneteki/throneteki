import ReturnGoldToTreasury from '../../../server/game/GameActions/ReturnGoldToTreasury.js';

describe('ReturnGoldToTreasury', function () {
    beforeEach(function () {
        this.playerSpy = jasmine.createSpyObj('player', ['modifyGold']);
        this.playerSpy.gold = 2;
        this.props = { player: this.playerSpy, amount: 3 };
    });

    describe('allow()', function () {
        describe('when the player has gold', function () {
            beforeEach(function () {
                this.playerSpy.gold = 1;
            });

            it('returns true', function () {
                expect(ReturnGoldToTreasury.allow(this.props)).toBe(true);
            });
        });

        describe('when the player has no gold', function () {
            beforeEach(function () {
                this.playerSpy.gold = 0;
            });

            it('returns false', function () {
                expect(ReturnGoldToTreasury.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = ReturnGoldToTreasury.createEvent(this.props);
        });

        it('creates an onGoldReturned event', function () {
            expect(this.event.name).toBe('onGoldReturned');
            expect(this.event.player).toBe(this.playerSpy);
            expect(this.event.amount).toBe(2);
            expect(this.event.desiredAmount).toBe(3);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('modifies the gold for the player', function () {
                expect(this.playerSpy.modifyGold).toHaveBeenCalledWith(-2);
            });
        });
    });
});
