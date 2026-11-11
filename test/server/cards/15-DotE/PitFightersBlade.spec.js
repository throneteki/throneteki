describe("Pit Fighter's Blade", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ["Pit Fighter's Blade"] }]
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character renown during [military] challenges', function () {
        expect(this.tumblestoneKnight.hasKeyword('Renown')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
