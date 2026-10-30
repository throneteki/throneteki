describe('Shadowblack Assassin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'targaryen', shadows: ['Shadowblack Assassin'], gold: 2 },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.shadowblackAssassin);
        this.player1.triggerAbility(this.shadowblackAssassin);
        this.player1.clickCard(this.winterfellSteward);
    });

    it('kills a character with STR 1 or lower after it comes out of shadows', function () {
        expect(this.winterfellSteward.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
