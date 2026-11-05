describe('Casterly Rock (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Casterly Rock (Core)', 'House Maester', 'Grand Maester Pycelle (Core)']
            }
        });
    });

    it('lets you initiate an additional [intrigue] challenge', function () {
        this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);

        expect(this.player1).not.toHaveDisabledPromptButton('Intrigue');

        this.unopposedChallenge(this.player1, 'Intrigue', this.grandMaesterPycelle);

        expect(this.player1).toHaveDisabledPromptButton('Intrigue');
        expect(this.player1).isReadyToTakeAction();
    });
});
