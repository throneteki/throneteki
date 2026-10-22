describe('Seize the Initiative', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: { hand: ['Seize the Initiative'] }
        });
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Seize the Initiative');
    });

    it('makes you the first player when the marshaling phase ends', function () {
        expect(this.player1Object.firstPlayer).toBe(true);
        expect(this.player2Object.firstPlayer).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
