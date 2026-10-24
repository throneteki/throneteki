describe('Pleasure Barge', function () {
    it('reduces your income by 1', function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['A Noble Cause'], inPlay: ['Pleasure Barge'] }
        });
        this.player1.selectPlot('A Noble Cause');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        expect(this.player1Object.gold).toBe(4);
    });

    it('draws 3 cards after you marshal it if you have not drawn this phase', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Pleasure Barge'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'The Roseroad'],
                gold: 10
            }
        });
        this.player1.clickCard(this.pleasureBarge);
        this.player1.triggerAbility('Pleasure Barge');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.theRoseroad.location).toBe('hand');
    });

    it('is immune to card effects', function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Political Disaster'] },
            player2: { inPlay: ['Pleasure Barge', 'The Roseroad', 'Highgarden (Core)'] }
        });
        this.player1.selectPlot('Political Disaster');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player2);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickCard(this.highgarden);
        this.player2.clickPrompt('Done');
        expect(this.pleasureBarge.location).toBe('play area');
    });
});
