describe('Outwit', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Outwit'], inPlay: ['Grand Maester Pycelle (Core)'] },
            player2: {
                plotDeck: ['Counting Coppers'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'Winterfell Steward']
            }
        });
        this.player1.selectPlot('Outwit');
        this.player2.selectPlot('Counting Coppers');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Outwit');
        this.player1.clickCard(this.grandMaesterPycelle);
    });

    it('kneels the faction card and a unique Maester to cancel a when revealed ability', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.grandMaesterPycelle.kneeled).toBe(true);
        expect(this.player2Object.hand.length).toBe(2);
    });
});
