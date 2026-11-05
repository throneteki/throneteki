describe('Myrcella Baratheon (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Myrcella Baratheon (ATT)', 'Cersei Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.myrcellaBaratheon);
        this.player1.triggerAbility(this.myrcellaBaratheon);
    });

    it('returns to your hand after you win a challenge she participates in, and lets you initiate an additional intrigue challenge', function () {
        expect(this.myrcellaBaratheon.location).toBe('hand');

        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);

        expect(this.cerseiLannister.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
