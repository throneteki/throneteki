describe('Littlefinger (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Littlefinger (TTWDFL)', 'Tumblestone Knight'] },
            player2: { hand: ['Confinement'], gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.confinement);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.littlefinger);
    });

    it('kneels to cancel the effects of an event', function () {
        expect(this.littlefinger.kneeled).toBe(true);
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
