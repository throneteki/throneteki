describe('Ser Balon Swann (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ser Balon Swann (R2)'], hand: ['Tumblestone Knight'], gold: 2 }
        });
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.serBalonSwann);
    });

    it('gains 2 gold after a non-lannister Knight enters play under your control', function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
