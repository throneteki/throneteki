describe('Ser Arys Oakheart (TC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'martell', hand: ['Ser Arys Oakheart (TC)'], gold: 6 },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.serArysOakheart);
        this.player1.triggerAbility(this.serArysOakheart);
        this.player1.clickCard(this.winterfellSteward);
    });

    it('pays 2 gold to discard an Ally character after he enters play', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
