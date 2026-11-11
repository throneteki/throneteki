describe('Theon Greyjoy (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Theon Greyjoy (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.theonGreyjoy);
        this.player1.triggerAbility(this.theonGreyjoy);
    });

    it('gains 1 power after you win an unopposed challenge he is participating in', function () {
        expect(this.theonGreyjoy.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
