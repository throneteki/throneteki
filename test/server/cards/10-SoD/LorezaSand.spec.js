describe('Loreza Sand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Loreza Sand', 'Trystane Martell (LoCR)'],
                drawDeck: ['Hot Pie (FFH)']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.trystaneMartell);
        this.player1.triggerAbility(this.lorezaSand);
    });

    it('draws 1 card when a unique martell character you control is killed', function () {
        expect(this.trystaneMartell.location).toBe('dead pile');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
