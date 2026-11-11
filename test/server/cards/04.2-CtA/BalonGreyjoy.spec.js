describe('Balon Greyjoy (CtA)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Balon Greyjoy (CtA)', 'Iron Fleet Scout'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.balonGreyjoy);
        this.player1.clickPrompt('Done');
    });

    it('does not kneel when attacking in a military challenge against an opponent without a King, and kneels a greyjoy location to give each loyal character you control +1 STR', function () {
        expect(this.balonGreyjoy.kneeled).toBe(false);

        this.player1.clickCard(this.balonGreyjoy);
        this.player1.clickCard(this.ironFleetScout);

        expect(this.ironFleetScout.kneeled).toBe(true);
        expect(this.balonGreyjoy.getStrength()).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
