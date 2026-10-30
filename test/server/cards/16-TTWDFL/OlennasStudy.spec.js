describe("Olenna's Study", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    "Olenna's Study",
                    'House Maester',
                    'Grand Maester Pycelle (Core)',
                    'Sansa Stark (WotN)'
                ]
            }
        });
    });

    it('lets each player initiate an additional [intrigue] challenge, and stops non-unique characters attacking or defending in them', function () {
        this.player1.clickPrompt('Intrigue');

        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        this.unopposedChallenge(this.player1, 'Intrigue', this.sansaStark);

        expect(this.player1).toHaveDisabledPromptButton('Intrigue');
        expect(this.player1).isReadyToTakeAction();
    });
});
