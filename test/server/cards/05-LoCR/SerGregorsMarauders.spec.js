describe("Ser Gregor's Marauders", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', inPlay: ["Ser Gregor's Marauders"] },
            player2: { drawDeck: ['Confinement'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serGregorsMarauders);
        this.player1.triggerAbility(this.serGregorsMarauders);
    });

    it('stands after it discards an event using pillage', function () {
        expect(this.confinement.location).toBe('discard pile');
        expect(this.serGregorsMarauders.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
