describe('Othell Yarwyck', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', inPlay: ['Othell Yarwyck', "Brandon's Gift"] }
        });
        this.player1.clickCard(this.othellYarwyck);
        this.player1.clickCard(this.brandonsGift);
        this.player1.clickCard(this.othellYarwyck);
        this.player1.clickPrompt('Military');
    });

    it('kneels a thenightswatch location to give a thenightswatch character a challenge icon of your choice', function () {
        expect(this.brandonsGift.kneeled).toBe(true);
        expect(this.othellYarwyck.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
