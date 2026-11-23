describe('White Harbor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['White Harbor', 'Hedge Knight'],
                drawDeck: ['Castle Guard', 'The Roseroad']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('White Harbor');
        this.player2.clickCard(this.theRoseroad);
    });

    it('reveals the top 2 cards after you win, adding the one the losing opponent chooses to your hand', function () {
        expect(this.theRoseroad.location).toBe('hand');
        const deck = this.player1Object.drawDeck;
        expect(deck[deck.length - 1]).toBe(this.castleGuard);
    });
});

describe('White Harbor when Sweetrobin removes one of the revealed cards', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['White Harbor', 'Hedge Knight', 'Sweetrobin'],
                drawDeck: ['Castle Guard', 'The Roseroad']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('White Harbor');
        this.player1.triggerAbility(this.sweetrobin);
        this.player1.clickCard(this.castleGuard);
    });

    it('has the losing opponent add the only remaining card to your hand', function () {
        expect(this.castleGuard.location).toBe('out of game');
        expect(this.player2).toBeAbleToSelect(this.theRoseroad);
        expect(this.player2).not.toBeAbleToSelect(this.castleGuard);
        expect(this.player2).not.toHavePromptButton('Done');
        this.player2.clickCard(this.theRoseroad);
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
