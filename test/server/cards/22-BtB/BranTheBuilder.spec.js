describe('Bran the Builder (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Bran the Builder (BtB)',
                inPlay: ['Tumblestone Knight'],
                drawDeck: ['House Maester', 'Heart Tree Grove']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.player1.triggerAbility(this.branTheBuilder);
    });

    it('searches the top 10 cards for a location after you win a challenge', function () {
        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

        this.player1.clickCard(this.heartTreeGrove);

        expect(this.heartTreeGrove.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
