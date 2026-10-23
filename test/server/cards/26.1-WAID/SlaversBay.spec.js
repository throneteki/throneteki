describe("Slaver's Bay", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Slaver's Bay", 'Astapor', 'Bronn (HMW)', 'Hedge Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.bronn);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
    });

    it('kills each participating character with 0 STR during military challenges while you control Astapor', function () {
        expect(this.bronn.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('play area');
    });
});
