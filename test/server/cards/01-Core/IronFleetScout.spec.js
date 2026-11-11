describe('Iron Fleet Scout', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Iron Fleet Scout', "Black Wind's Crew"] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.blackWindsCrew);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironFleetScout);
        this.player1.clickCard(this.blackWindsCrew);
    });

    it('kneels to give a participating greyjoy character +2 STR while you are the first player', function () {
        expect(this.ironFleetScout.kneeled).toBe(true);
        expect(this.blackWindsCrew.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
