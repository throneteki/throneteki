describe('The Bastard of Driftmark (LotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Sweet Cersei'],
                inPlay: [{ card: 'The Bastard of Driftmark (LotW)', kneeling: true }]
            }
        });
        this.player1.clickCard(this.sweetCersei);
        this.player1.triggerAbility(this.theBastardOfDriftmark);
    });

    it('stands after a Warship location enters play under your control', function () {
        expect(this.theBastardOfDriftmark.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
