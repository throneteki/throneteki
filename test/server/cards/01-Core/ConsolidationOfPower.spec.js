describe('Consolidation of Power', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Consolidation of Power'] },
            player2: { inPlay: ['Hedge Knight', 'Winterfell Steward'] }
        });
        this.player1.clickCard(this.consolidationOfPower);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('kneels up to 4 STR of characters controlled by one player, then has one of them gain 1 power', function () {
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.winterfellSteward.kneeled).toBe(true);
        expect(this.hedgeKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
