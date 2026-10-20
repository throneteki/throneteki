import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('switch game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Winterfell Steward'],
                discard: ['Tumblestone Knight'],
                inPlay: ['House Dayne Knight']
            }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.houseDayneKnight
        });
        this.switchCards = (cards) => {
            this.game.resolveGameAction(GameActions.switch({ cards }), this.context);
            this.game.continue();
        };
    });

    it('switches two cards in different locations', function () {
        this.switchCards([this.winterfellSteward, this.tumblestoneKnight]);

        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('hand');
    });

    it('switches the top and bottom cards of a deck', function () {
        const deck = this.player1Object.drawDeck;
        const top = deck[0];
        const bottom = deck[deck.length - 1];

        this.switchCards([top, bottom]);

        const switched = this.player1Object.drawDeck;
        expect(switched[0]).toBe(bottom);
        expect(switched[switched.length - 1]).toBe(top);
        expect(switched).toHaveLength(deck.length);
    });

    it('does not resolve unless there is a card on each side', function () {
        expect(GameActions.switch({ cards: [this.winterfellSteward] }).allow()).toBe(false);
        expect(GameActions.switch({ cards: [this.winterfellSteward, undefined] }).allow()).toBe(
            false
        );
        expect(
            GameActions.switch({ cards: [this.winterfellSteward, this.winterfellSteward] }).allow()
        ).toBe(false);
    });
});
