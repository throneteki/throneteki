describe('Black Walder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Black Walder', gold: 1 }, 'Tumblestone Knight', 'House Maester']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.blackWalder);
        this.player1.clickPrompt('Done');
    });

    it('gains renown and +2 STR for each of his gold during the third challenge you initiate each phase', function () {
        expect(this.blackWalder.hasKeyword('Renown')).toBe(true);
        expect(this.blackWalder.getStrength()).toBe(5);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
