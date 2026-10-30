describe('Devan Seaworth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Devan Seaworth', gold: 2 }],
                drawDeck: ['Casterly Rock (Core)']
            }
        });

        this.completeChallengesPhase();
        this.player1.triggerAbility(this.devanSeaworth);
    });

    it('discards X gold to put a non-limited location with printed cost X or lower into play after you win dominance', function () {
        this.player1.selectValue('2');
        this.player1.clickCard(this.casterlyRock);

        expect(this.casterlyRock.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
