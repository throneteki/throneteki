describe('Cersei Lannister (DitD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Cersei Lannister (DitD)', 'Tumblestone Knight'],
                shadows: ['Naught but Ashes (FUtG)'],
                gold: 1
            },
            player2: { hand: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.naughtButAshes);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.cerseiLannister);
    });

    it('has each opponent discard 1 card at random after a card you control comes out of shadows during the challenges phase', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
