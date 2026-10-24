describe('Daenerys Targaryen (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Daenerys Targaryen (DotE)'],
                drawDeck: ['Tumblestone Knight', 'Drogon (Core)']
            }
        });

        this.player1.clickCard(this.daenerysTargaryen);
    });

    it('searches the top 10 cards for an attachment or Dragon, and may put one with printed cost 3 or lower into play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.drogon);
        this.player1.clickPrompt('Put in play');

        expect(this.drogon.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
