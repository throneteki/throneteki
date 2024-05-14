import LookAtHand from '../../../server/game/GameActions/LookAtHand.js';

describe('LookAtHand', function () {
    beforeEach(function () {
        this.playerSpy = { player: 1 };
        this.opponentSpy = { player: 2, name: 'opponent', hand: ['card1', 'card2'] };
        this.gameSpy = jasmine.createSpyObj('game', ['promptForSelect']);
        this.contextSpy = {
            game: this.gameSpy,
            source: 'SOURCE'
        };
        this.props = {
            player: this.playerSpy,
            opponent: this.opponentSpy,
            context: this.contextSpy
        };
    });

    describe('allow()', function () {
        describe('when the opponent has cards in hand', function () {
            beforeEach(function () {
                this.opponentSpy.hand = ['card1', 'card2'];
            });

            it('returns true', function () {
                expect(LookAtHand.allow(this.props)).toBe(true);
            });
        });

        describe('when the opponent has no cards in hand', function () {
            beforeEach(function () {
                this.opponentSpy.hand = [];
            });

            it('returns false', function () {
                expect(LookAtHand.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = LookAtHand.createEvent(this.props);
        });

        it('creates a onLookAtHand event', function () {
            expect(this.event.name).toBe('onLookAtHand');
            expect(this.event.player).toBe(this.playerSpy);
            expect(this.event.opponent).toBe(this.opponentSpy);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('prompts the player', function () {
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                    this.playerSpy,
                    jasmine.any(Object)
                );
            });

            it('uses the correct prompt properties', function () {
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        activePromptTitle: "Look at opponent's hand",
                        source: 'SOURCE',
                        revealTargets: true
                    })
                );
            });
        });
    });
});
