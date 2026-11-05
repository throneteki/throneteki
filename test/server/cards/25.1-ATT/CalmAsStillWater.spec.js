describe('Calm as Still Water (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Calm as Still Water (ATT)'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("saves a character with printed cost 3 or lower and returns it to its owner's hand", function () {
        this.player1.triggerAbility(this.calmAsStillWater);

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
