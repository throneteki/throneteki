describe('Andrik the Unsmiling', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Andrik the Unsmiling'] },
            player2: { inPlay: ['Iron Fleet Scout'], discard: ['Iron Fleet Scout'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.andrikTheUnsmiling);
        this.player1.triggerAbility(this.andrikTheUnsmiling);
        this.player1.clickCard(
            this.player2Object.discardPile.find(
                (card) => card !== this.ironFleetScout && card.name === 'Iron Fleet Scout'
            )
        );
        this.player1.clickCard(this.ironFleetScout);
    });

    it("discards a copy of a non-limited location or attachment in the losing opponent's discard pile from play after he pillages", function () {
        expect(this.ironFleetScout.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
