describe('Valyrian Steel Dagger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'House Maester', attachments: ['Valyrian Steel Dagger'] }]
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character +2 STR and stealth during [intrigue] challenges', function () {
        expect(this.houseMaester.getStrength()).toBe(4);
        expect(this.houseMaester.hasKeyword('Stealth')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
