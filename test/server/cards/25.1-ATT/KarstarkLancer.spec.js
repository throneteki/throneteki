describe('Karstark Lancer (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Karstark Lancer (ATT)', 'The Kingsroad']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.karstarkLancer);
    });

    it('has each player choose a location they control to gain 1 power when he is killed', function () {
        this.player1.triggerAbility(this.karstarkLancer);
        this.player1.clickCard(this.theKingsroad);

        expect(this.theKingsroad.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
