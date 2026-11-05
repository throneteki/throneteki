describe('Journey to Oldtown', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                faction: 'tyrell',
                inPlay: ['Hedge Knight'],
                hand: ['Journey to Oldtown'],
                plotDeck: ['Filler Plot', 'Filler Plot']
            }
        });
        this.player1.triggerAbility('Journey to Oldtown');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('removes a character you control from the game after the plot phase begins', function () {
        expect(this.hedgeKnight.location).toBe('out of game');
    });

    it('returns it at the beginning of the next plot phase', function () {
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        expect(this.hedgeKnight.location).toBe('play area');
    });
});
