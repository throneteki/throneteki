describe('Bound for the Wall (TB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], hand: ['Bound for the Wall (TB)'], gold: 5 },
            player2: { drawDeck: ['Castle Guard', 'The Roseroad', 'Winterfell Steward'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Bound for the Wall');
    });

    it("reveals the top 5 cards of the loser's deck and lets you put a character revealed into play under your control", function () {
        expect(this.player1).not.toAllowSelect(this.theRoseroad);
        this.player1.clickCard(this.castleGuard);
        expect(this.castleGuard.location).toBe('play area');
        expect(this.castleGuard).toBeControlledBy(this.player1);
        expect(this.player2Object.drawDeck.slice(-4)).toContain(this.theRoseroad);
        expect(this.player2Object.drawDeck.slice(-4)).toContain(this.winterfellSteward);
    });

    it('places every revealed card on the bottom of their deck if you put none into play', function () {
        this.player1.clickPrompt('Done');
        const bottom = this.player2Object.drawDeck.slice(-5);
        expect(bottom).toContain(this.castleGuard);
        expect(bottom).toContain(this.theRoseroad);
        expect(bottom).toContain(this.winterfellSteward);
        expect(this.player1).isReadyToTakeAction();
    });
});
