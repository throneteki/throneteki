describe('Galbart Glover', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Snowed Under',
                inPlay: ['Galbart Glover']
            },
            player2: {
                hand: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Done');
    });

    it('increases the cost of the first character each opponent marshals each phase by 1 while there are more Winter than Summer plots', function () {
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.player2Object.gold).toBe(2);

        this.player2.clickCard(this.bastardInHiding);

        expect(this.player2Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
