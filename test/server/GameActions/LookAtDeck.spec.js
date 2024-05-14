import LookAtDeck from '../../../server/game/GameActions/LookAtDeck.js';

describe('LookAtDeck', function () {
    beforeEach(function () {
        this.playerSpy = { player: 1 };
        this.opponentSpy = { player: 2, name: 'opponent', drawDeck: ['card1', 'card2'] };
        this.gameSpy = jasmine.createSpyObj('game', ['promptForSelect']);
        this.contextSpy = {
            game: this.gameSpy,
            source: 'SOURCE'
        };
        this.props = {
            player: this.playerSpy,
            lookingAt: this.opponentSpy,
            amount: 3,
            context: this.contextSpy
        };
    });

    describe('allow()', function () {
        describe('when the opponent has cards in their deck', function () {
            beforeEach(function () {
                this.opponentSpy.drawDeck = ['card1', 'card2'];
            });

            it('returns true', function () {
                expect(LookAtDeck.allow(this.props)).toBe(true);
            });
        });

        describe('when the opponent has no cards in their deck', function () {
            beforeEach(function () {
                this.opponentSpy.drawDeck = [];
            });

            it('returns false', function () {
                expect(LookAtDeck.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = LookAtDeck.createEvent(this.props);
        });

        it('creates a onLookAtDeck event', function () {
            expect(this.event.name).toBe('onLookAtDeck');
            expect(this.event.player).toBe(this.playerSpy);
            expect(this.event.lookingAt).toBe(this.opponentSpy);
            expect(this.event.amount).toBe(2);
            expect(this.event.desiredAmount).toBe(3);
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
                        activePromptTitle: "Look at opponent's deck",
                        source: 'SOURCE',
                        revealTargets: true
                    })
                );
            });

            it('sets the top cards', function () {
                expect(this.event.topCards).toEqual(['card1', 'card2']);
            });
        });
    });
});
