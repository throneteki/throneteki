describe('Redwyne Merchanter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Redwyne Merchanter'], inPlay: ['Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickCard(this.redwyneMerchanter);
        this.player1.triggerAbility(this.redwyneMerchanter);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a character +2 STR after it comes out of shadows', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
