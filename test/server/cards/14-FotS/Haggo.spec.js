describe('Haggo', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Haggo'],
                hand: ['Tumblestone Knight'],
                discard: ['Khal Drogo (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.haggo);
        this.player1.triggerAbility(this.haggo);
    });

    it('discards a card from your hand to return a Dothraki card from your discard pile to your hand after a challenge he wins', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.khalDrogo);

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.khalDrogo.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
