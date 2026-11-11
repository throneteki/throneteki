describe('Abandoned Stronghold (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Abandoned Stronghold (R)', 'Veteran Builder'] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.veteranBuilder);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.abandonedStronghold);
        this.player1.clickCard(this.veteranBuilder);
    });

    it('kneels to give a defending character +1 STR for each Builder character you control until the end of the challenge', function () {
        expect(this.veteranBuilder.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
