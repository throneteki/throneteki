describe('Naval Bombardment', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Kingsroad'], hand: ['Naval Bombardment'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickCard(this.navalBombardment);
        this.player1.clickPrompt('Done');
    });

    it('stops an opponent who controls fewer locations initiating intrigue challenges against you this phase', function () {
        expect(this.player2).toHaveDisabledPromptButton('Intrigue');
        expect(this.player2).not.toHaveDisabledPromptButton('Military');
        expect(this.player2).isReadyToTakeAction();
    });
});
