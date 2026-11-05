describe('Shrewd Diplomat', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Shrewd Diplomat'], gold: 5 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.shrewdDiplomat);
        this.player1.triggerAbility(this.shrewdDiplomat);
        this.player1.clickCard(this.khalDrogo);
    });

    it('stands a participating character and removes it from the challenge after it enters play during a challenge', function () {
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.khalDrogo.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
