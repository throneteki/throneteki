describe('Sons of the Harpy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['Sons of the Harpy'], inPlay: ['Khal Drogo (Core)'], gold: 2 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.sonsOfTheHarpy);
        this.player1.triggerAbility(this.sonsOfTheHarpy);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gives a participating character -2 STR after it comes out of shadows', function () {
        expect(this.khalDrogo.getStrength()).toBe(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
