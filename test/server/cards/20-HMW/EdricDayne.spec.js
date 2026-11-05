describe('Edric Dayne (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Edric Dayne (HMW)', 'Old Forest Hunter'], hand: ['Hot Pie (FFH)'] }
        });
        this.player1.clickMenu(this.oldForestHunter, 'Discard a card to gain 1 gold');
        this.player1.clickCard(this.hotPie);
        this.player1.triggerAbility(this.edricDayne);
    });

    it('places a non-loyal card in shadows after it enters your discard pile', function () {
        expect(this.hotPie.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
