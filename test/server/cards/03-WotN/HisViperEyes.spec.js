describe('His Viper Eyes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['His Viper Eyes'] },
            player2: { inPlay: ['Khal Drogo (Core)'], hand: ['Hot Pie (FFH)', 'Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.hisViperEyes);
        this.player1.clickCard(this.hotPie);
    });

    it("looks at the winning opponent's hand and discards a card of your choice from it after you lose a power challenge as the defender", function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
