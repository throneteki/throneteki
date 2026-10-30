describe('Selyse Baratheon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Hedge Knight', 'Catelyn Stark (Core)'],
                hand: ['Selyse Baratheon (FotOG)'],
                gold: 6
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickCard(this.selyseBaratheon);
    });

    it('kneels your faction card, then each non-Lady character', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.castleGuard.kneeled).toBe(true);
        expect(this.catelynStark.kneeled).toBe(false);
        expect(this.selyseBaratheon.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
