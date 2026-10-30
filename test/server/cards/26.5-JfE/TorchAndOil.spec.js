describe('Torch and Oil', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [
                    {
                        card: 'Ser Jaime Lannister (Core)',
                        kneeling: true,
                        attachments: ['Torch and Oil']
                    }
                ]
            },
            player2: { drawDeck: ['Tumblestone Knight', 'Sweet Cersei'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.torchAndOil);
    });

    it('kneels to reveal a card an opponent draws, and is sacrificed to discard it and stand the attached character if it is a character', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Yes');

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.serJaimeLannister.kneeled).toBe(false);
        expect(this.torchAndOil.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
