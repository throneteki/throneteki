describe('Rickard Karstark', function () {
    it('kneels a The North location to have each player sacrifice a character or location', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Rickard Karstark (FH)', 'Northern Keep', 'Hedge Knight'] },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickMenu(this.rickardKarstark, 'Sacrifice character or location');
        this.player1.clickCard(this.northernKeep);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        expect(this.northernKeep.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('discard pile');
    });

    it('returns a The North location from your discard pile to your hand after a Winter plot is revealed', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Famine'],
                inPlay: ['Rickard Karstark (FH)'],
                discard: ['Northern Keep']
            }
        });
        this.player1.selectPlot('Famine');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Rickard Karstark');
        this.player1.clickCard(this.northernKeep);
        expect(this.northernKeep.location).toBe('hand');
    });
});
