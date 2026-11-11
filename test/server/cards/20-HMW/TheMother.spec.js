describe('The Mother (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'The Mother (HMW)' },
            player2: { hand: ['Hot Pie (FFH)', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.hotPie);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.theMother);
    });

    it("draws 1 card after a second character enters play under an opponent's control this round", function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
