describe('Desperate Deserter', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { shadows: ['Desperate Deserter'] } });
        this.player1.clickCard(this.desperateDeserter);
        this.player1.triggerAbility(this.desperateDeserter);
    });

    it('gives control of itself to an opponent after a card you control comes out of shadows', function () {
        expect(this.desperateDeserter.controller).toBe(this.player2Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
