describe('Mace Tyrell (SAT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Mace Tyrell (SAT)'],
                drawDeck: ['Tumblestone Knight', 'Sweet Cersei']
            }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maceTyrell);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.maceTyrell);
    });

    it('draws 2 cards after he kneels, then places a card from your hand on top of your deck', function () {
        this.player1.clickCard(this.sweetCersei);

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.sweetCersei.location).toBe('draw deck');

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
