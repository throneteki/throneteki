describe('A Thousand Eyes, and One', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['"A Thousand Eyes, and One" (WK)'], drawDeck: ['Hedge Knight'] },
            player2: { hand: ['Castle Guard'] }
        });
        this.player1.clickCard(this.aThousandEyesAndOne);
        this.player1.clickPrompt('Hand');
        this.player1.clickPrompt('Done');
    });

    it("kneels your faction card to look at an opponent's hand, and draws 1 card", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
