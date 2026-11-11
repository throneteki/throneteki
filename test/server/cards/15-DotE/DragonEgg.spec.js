describe('Dragon Egg', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [{ card: 'Daenerys Targaryen (Core)', attachments: ['Dragon Egg'] }],
                drawDeck: ['Tumblestone Knight', 'House Maester', 'Drogon (Core)']
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('gives the attached character insight, and sacrifices to put a Hatchling into play after the marshaling phase begins', function () {
        expect(this.daenerysTargaryen.hasKeyword('Insight')).toBe(true);

        this.player1.triggerAbility(this.dragonEgg);
        this.player1.clickCard(this.drogon);

        expect(this.dragonEgg.location).toBe('discard pile');
        expect(this.drogon.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
