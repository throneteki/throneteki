describe('Maester of Sunspear', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Maester of Sunspear'] },
            player2: {
                inPlay: [{ card: 'Littlefinger (Core)', attachments: ['Little Bird (Core)'] }]
            }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maesterOfSunspear);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.maesterOfSunspear);
        this.player1.clickCard(this.littleBird);
    });

    it("returns an attachment to its owner's hand after you lose a challenge it is participating in", function () {
        expect(this.littleBird.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
