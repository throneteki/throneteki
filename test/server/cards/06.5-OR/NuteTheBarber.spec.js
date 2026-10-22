describe('Nute the Barber', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Nute the Barber'], drawDeck: ['Ranging Party'] },
            player2: { drawDeck: ['Hedge Knight'], discard: ['Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.nuteTheBarber);
        this.player1.triggerAbility('Nute the Barber');
        this.player1.clickCard(this.castleGuard);
    });

    it("returns a card from the loser's discard pile to their hand, then draws 1 card", function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.rangingParty.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
