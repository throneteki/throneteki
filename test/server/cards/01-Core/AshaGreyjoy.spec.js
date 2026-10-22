describe('Asha Greyjoy (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Asha Greyjoy (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.ashaGreyjoy);
        this.player1.triggerAbility(this.ashaGreyjoy);
    });

    it('stands after you win an unopposed challenge she is participating in', function () {
        expect(this.ashaGreyjoy.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
