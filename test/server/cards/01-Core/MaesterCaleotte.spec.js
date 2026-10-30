describe('Maester Caleotte', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Caleotte'] },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maesterCaleotte);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.maesterCaleotte);
        this.player1.clickCard(this.littlefinger);
        this.player1.clickPrompt('Intrigue');
    });

    it('makes a character lose a challenge icon of your choice after you lose a challenge he is participating in', function () {
        expect(this.littlefinger.hasIcon('intrigue')).toBe(false);
        expect(this.littlefinger.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
