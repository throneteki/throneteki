describe('Broken Vows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ranging Party'], hand: ['Broken Vows'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.brokenVows);
        this.player1.clickCard(this.rangingParty);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('gives control of a nightswatch character to an opponent, then takes control of a cheaper non-loyal character', function () {
        expect(this.rangingParty.controller).toBe(this.player2Object);
        expect(this.hedgeKnight.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
