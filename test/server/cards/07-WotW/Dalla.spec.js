describe('Dalla', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Dalla'],
                hand: ['Wildling Scout'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 2
            }
        });
        this.player1.clickCard(this.wildlingScout);
        this.player1.triggerAbility(this.dalla);
    });

    it('draws 1 card after a Wildling character enters play under your control', function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
