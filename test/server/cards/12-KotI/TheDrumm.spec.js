describe('The Drumm', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Drumm']
            },
            player2: {
                inPlay: ['House Maester', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theDrumm);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops each character with an [intrigue] icon defending while he attacks in a [military] or [power] challenge', function () {
        expect(this.player2).not.toBeAbleToSelect(this.houseMaester);
        expect(this.player2).toBeAbleToSelect(this.bastardInHiding);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
