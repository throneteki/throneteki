describe('Alleras the Sphinx', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Fealty',
                inPlay: ['Alleras the Sphinx'],
                drawDeck: ['Tumblestone Knight']
            },
            player2: { inPlay: ['Cersei Lannister (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.allerasTheSphinx);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.cerseiLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.allerasTheSphinx);
    });

    it('searches the top 10 cards of your deck for a card to place under your agenda after you lose a challenge he participates in', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('underneath');
        expect(this.player1).isReadyToTakeAction();
    });
});
