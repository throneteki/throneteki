describe('Areo Hotah (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Areo Hotah (SoD)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.areoHotah);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.areoHotah);
    });

    it('returns to your hand to raise your claim by 1 until the end of the phase after you win a challenge he defends in', function () {
        expect(this.areoHotah.location).toBe('hand');
        expect(this.player1Object.activePlot.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
