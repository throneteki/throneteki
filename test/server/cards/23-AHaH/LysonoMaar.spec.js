describe('Lysono Maar (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Lysono Maar (AHaH)']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.player1.clickPrompt('Intrigue');
    });

    it('has defenders declared before attackers in the first challenge you initiate each phase', function () {
        expect(this.player2).toBeAbleToSelect(this.houseMaester);

        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.lysonoMaar);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
