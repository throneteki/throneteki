describe('The Blue Bard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Blue Bard'],
                drawDeck: ['"The Dornishman\'s Wife" (R)']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.theBlueBard);
    });

    it('searches the top 10 cards for any number of Song events when he leaves play', function () {
        this.player1.triggerAbility(this.theBlueBard);
        this.player1.clickCard(this.theDornishmansWife);
        this.player1.clickPrompt('Done');

        expect(this.theDornishmansWife.location).toBe('hand');

        this.player1.clickPrompt('Pass');

        expect(this.player2).isReadyToTakeAction();
    });
});
