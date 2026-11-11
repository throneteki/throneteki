describe("King's Landing (TTWDFL)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ["King's Landing (TTWDFL)"],
                hand: ['The Kingsroad']
            }
        });

        this.player1.clickCard(this.theKingsroad);
        this.player1.triggerAbility(this.kingsLanding);
    });

    it('draws 1 card after you marshal a location', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
