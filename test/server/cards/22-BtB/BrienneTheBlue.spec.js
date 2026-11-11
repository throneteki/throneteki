describe('Brienne the Blue (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Brienne the Blue (BtB)'], inPlay: ['Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.brienneTheBlue);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a character attacking or defending alone +5 STR until the end of the challenge', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(7);
        expect(this.player2).isReadyToTakeAction();
    });
});
